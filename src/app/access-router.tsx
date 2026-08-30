import { Pressable, TextInput, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { accessRouter, accessRouterDark, accessRouterLight, accessRouterPalette } from "@/src/styles/app/style";
import ScreenBackground from "@/src/components/screen-background";
import { useRef, useState } from "react";
import { useAppContext } from "../components/app-context-provider";

export default function AccessRouter() {
    const { lastDevice } = useAppContext();
    const isDark = useColorScheme() === "dark";
    const theme = isDark ? accessRouterDark : accessRouterLight;
    const palette = isDark ? accessRouterPalette.dark : accessRouterPalette.light;
    const hasAutofilledLogin = useRef(false);
    const webViewRef = useRef<WebView>(null);
    const initialUri = `http://${lastDevice?.ip}`;
    const [uri, setUri] = useState<string>(initialUri);
    const [address, setAddress] = useState<string>(initialUri);

    function autofillLogin(): void {
        const password = lastDevice?.admin_pass;
        const routerHost = lastDevice?.ip;
        if (hasAutofilledLogin.current || password === null || password === undefined || !routerHost) {
            return;
        }

        const serializedPassword = JSON.stringify(password);
        const serializedRouterHost = JSON.stringify(routerHost);
        webViewRef.current?.injectJavaScript(`
            (() => {
                if (window.location.hostname !== ${serializedRouterHost}) {
                    return;
                }

                const findPasswordInput = (currentDocument) => {
                    const passwordInput = currentDocument.querySelector('input[type="password"], input[name="password"], input[name="Password"]');
                    if (passwordInput !== null) {
                        return passwordInput;
                    }

                    const frames = currentDocument.querySelectorAll("frame, iframe");
                    for (const frame of frames) {
                        try {
                            const frameDocument = frame.contentDocument;
                            if (frameDocument) {
                                const framePasswordInput = findPasswordInput(frameDocument);
                                if (framePasswordInput !== null) {
                                    return framePasswordInput;
                                }
                            }
                        } catch {}
                    }

                    return null;
                };

                const autofillPassword = () => {
                    const passwordInput = findPasswordInput(document);
                    if (passwordInput === null) {
                        return false;
                    }

                    const inputWindow = passwordInput.ownerDocument.defaultView;
                    const valueSetter = Object.getOwnPropertyDescriptor(inputWindow.HTMLInputElement.prototype, "value").set;
                    valueSetter.call(passwordInput, ${serializedPassword});
                    passwordInput.dispatchEvent(new inputWindow.Event("input", { bubbles: true }));
                    passwordInput.dispatchEvent(new inputWindow.Event("change", { bubbles: true }));

                    const form = passwordInput.closest("form");
                    const submitSelector = 'button[type="submit"], input[type="submit"], button:not([type]), .login_button, button.login-btn, button[data-cy="loginBtn"], input#loginSub, input.subBtn';
                    setTimeout(() => {
                        const currentDocument = passwordInput.ownerDocument;
                        const loginButton = currentDocument.querySelector('button[data-cy="loginBtn"], button.login-btn');
                        const submitButton = loginButton ?? form?.querySelector(submitSelector) ?? currentDocument.querySelector(submitSelector);
                        submitButton?.click();
                    }, 100);

                    window.ReactNativeWebView.postMessage("LOGIN_AUTOFILLED");
                    return true;
                };

                if (autofillPassword()) {
                    return;
                }

                const interval = setInterval(() => {
                    if (autofillPassword()) {
                        clearInterval(interval);
                    }
                }, 250);
            })();
            true;
        `);
    }

    if (!lastDevice?.ip) {
        return <Redirect href="/tab-nav-screens" />;
    }

    return (
        <ScreenBackground>
            <SafeAreaView edges={["bottom", "left", "right"]} style={[accessRouter.screen, theme.screen]}>
                <View style={[accessRouter.addressBar, theme.addressBar]}>
                    <Ionicons color={palette.icon} name="globe-outline" size={18} />
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        onChangeText={setAddress}
                        onSubmitEditing={() => setUri(address)}
                        selectTextOnFocus
                        style={[accessRouter.addressInput, theme.addressInput]}
                        value={address}
                    />
                    <Pressable accessibilityLabel="Recargar página" hitSlop={8} onPress={() => webViewRef.current?.reload()}>
                        <Ionicons color={palette.icon} name="refresh-outline" size={22} />
                    </Pressable>
                </View>
                <View style={[accessRouter.webViewContainer, theme.webViewContainer]}>
                    <WebView
                        ref={webViewRef}
                        source={{ uri }}
                        onNavigationStateChange={({ url }) => setAddress(url)}
                        onLoadEnd={autofillLogin}
                        onMessage={({ nativeEvent }) => {
                            if (nativeEvent.data === "LOGIN_AUTOFILLED") {
                                hasAutofilledLogin.current = true;
                            }
                        }}
                        javaScriptEnabled
                        domStorageEnabled
                    />
                </View>
            </SafeAreaView>
        </ScreenBackground>
    );
}
