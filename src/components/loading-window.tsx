import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Text, View, useColorScheme } from "react-native";
import { useAppContext } from "./app-context-provider";
import { loadingWindow, loadingWindowDark, loadingWindowLight } from "@/src/styles/components/style";

const DISPLAY_DELAY_MS = 1500;

export default function LoadingWindow() {
    const { isLoading, loadingStartedAt } = useAppContext();
    const [visibleForStart, setVisibleForStart] = useState<number | null>(null);
    const theme = useColorScheme() === "dark" ? loadingWindowDark : loadingWindowLight;

    useEffect(() => {
        if (!isLoading || loadingStartedAt === null) {
            return undefined;
        }

        const remainingDelay = Math.max(0, DISPLAY_DELAY_MS - (Date.now() - loadingStartedAt));
        const timeout = setTimeout(() => setVisibleForStart(loadingStartedAt), remainingDelay);
        return () => clearTimeout(timeout);
    }, [isLoading, loadingStartedAt]);

    return (
        <Modal
            animationType="fade"
            onRequestClose={() => undefined}
            statusBarTranslucent
            transparent
            visible={isLoading && visibleForStart === loadingStartedAt}
        >
            <View style={[loadingWindow.backdrop, theme.backdrop]}>
                <View style={[loadingWindow.window, theme.window]}>
                    <ActivityIndicator color={theme.indicator.color} size="large" />
                    <Text style={[loadingWindow.text, theme.text]}>Procesando…</Text>
                </View>
            </View>
        </Modal>
    );
}
