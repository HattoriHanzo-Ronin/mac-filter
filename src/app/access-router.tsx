import { TextInput, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { accessRouter } from "../styles";
import { useRef, useState } from "react";
import { useAppContext } from "../components/app-context-provider";

export default function AccessRouter() {
    const { lastDevice } = useAppContext();
    const hasAutofilledLogin = useRef(false);
    const webViewRef = useRef<WebView>(null);
    const initialUri = `http://${lastDevice?.ip}`;
    const [uri, setUri] = useState(initialUri);
    const [address, setAddress] = useState(initialUri);

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
        return <Redirect href="/main-app" />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={accessRouter.parent}>
                <Pressable onPress={() => router.replace("/main-app")}>
                    <Ionicons name="arrow-back" size={20} />
                </Pressable>
                <TextInput
                    style={accessRouter.tabInput}
                    value={address}
                    onChangeText={setAddress}
                    onSubmitEditing={() => setUri(address)}
                />
            </View>
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
        </SafeAreaView>
    );
}
