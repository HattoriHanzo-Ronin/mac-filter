import { Slot } from "expo-router";
import AppContextProvider from "@/src/components/AppContextProvider";
import { BackHandler, ToastAndroid, View } from "react-native";
import { useEffect, useRef } from "react";

export default function RootLayout() {
    const lastTouch = useRef(0);

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            const now = Date.now();
            if (lastTouch.current && now - lastTouch.current < 300) {
                BackHandler.exitApp();
            } else {
                lastTouch.current = now;
                ToastAndroid.show("Presiona otra vez para salir", ToastAndroid.SHORT);
                return true;
            }
        });

        return () => sub.remove();
    }, []);

    return (
        <AppContextProvider>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Slot />
            </View>
        </AppContextProvider>
    );
}
