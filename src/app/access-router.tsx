import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { accessRouter, accessRouterPalette, accessRouterStyles } from "@/src/styles/app/style";
import ScreenBackground from "@/src/components/screen-background";
import { useTheme } from "@/src/components/theme-provider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../components/app-context-provider";
import { useOperationContext } from "../components/operations-provider";
import type { RouterCpanelNavigationAction } from "../types/router-cpanel";

export default function AccessRouter() {
    const { lastDevice } = useAppContext();
    const { executeApiRequest } = useOperationContext();
    const { mode } = useTheme();
    const theme = accessRouterStyles[mode];
    const palette = accessRouterPalette[mode];
    const sessionId = useRef<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const routerId = lastDevice?.type === "ROUTER" ? lastDevice.id : undefined;

    const navigate = useCallback(async (action: RouterCpanelNavigationAction): Promise<void> => {
        const currentSessionId = sessionId.current;
        if (currentSessionId) {
            const result = await executeApiRequest((apiUtils) => apiUtils.navigateRouterCpanelSession(currentSessionId, action));
            if (!result.success) {
                router.replace("/");
            }
        }
    }, [executeApiRequest]);

    useEffect(() => {
        if (!routerId) {
            return undefined;
        }

        const activeRouterId = routerId;
        let isActive = true;
        async function createSession(): Promise<void> {
            const result = await executeApiRequest((apiUtils) => apiUtils.createRouterCpanelSession(activeRouterId, mode));
            if (!result.success) {
                router.replace("/");
                return;
            }

            if (!isActive) {
                void executeApiRequest((apiUtils) => apiUtils.closeRouterCpanelSession(result.data.id), true);
                return;
            }

            sessionId.current = result.data.id;
            setUrl(result.data.url);
        }

        void createSession();
        return () => {
            isActive = false;
            const currentSessionId = sessionId.current;
            sessionId.current = null;
            if (currentSessionId) {
                void executeApiRequest((apiUtils) => apiUtils.closeRouterCpanelSession(currentSessionId), true);
            }
        };
    }, [executeApiRequest, mode, routerId]);

    if (!routerId) {
        return <Redirect href="/tab-nav-screens" />;
    }

    return (
        <ScreenBackground>
            <SafeAreaView edges={["bottom", "left", "right"]} style={[accessRouter.screen, theme.screen]}>
                <View style={[accessRouter.webViewContainer, theme.webViewContainer]}>
                    {url && <WebView domStorageEnabled javaScriptEnabled source={{ uri: url }} />}
                </View>
                <View style={accessRouter.actions}>
                    <Pressable accessibilityLabel="Volver en el panel" disabled={!url} hitSlop={8} style={accessRouter.action} onPress={() => void navigate("back")}>
                        <Ionicons color={palette.icon} name="arrow-back-outline" size={22} />
                    </Pressable>
                    <Pressable accessibilityLabel="Recargar panel" disabled={!url} hitSlop={8} style={accessRouter.action} onPress={() => void navigate("reload")}>
                        <Ionicons color={palette.icon} name="refresh-outline" size={22} />
                    </Pressable>
                </View>
            </SafeAreaView>
        </ScreenBackground>
    );
}
