import { Stack } from "expo-router";
import AppContextProvider from "@/src/components/app-context-provider";
import UserMenu from "./_user-menu";
import { rootLayout } from "@/src/styles/app/style";
import { BackHandler, ToastAndroid, View } from "react-native";
import { useEffect, useRef } from "react";

export default function RootLayout() {
    const lastTouch = useRef(0);
    const screens = [
        { name: "index", options: { headerShown: false } },
        { name: "tab-nav-screens" },
        { name: "mac-filter" },
        { name: "access-router" }
    ];

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            const now = Date.now();
            if (lastTouch.current && now - lastTouch.current < 300) {
                BackHandler.exitApp();
                return true;
            }

            lastTouch.current = now;
            ToastAndroid.show("Presiona otra vez para salir", ToastAndroid.SHORT);
            return true;
        });

        return () => sub.remove();
    }, []);

    return (
        <AppContextProvider>
            <View style={rootLayout.screen}>
                <Stack>
                    {screens.map(({ name, options }) => (
                        <Stack.Screen
                            key={name}
                            name={name}
                            options={
                                options ?? { headerTitle: "", headerShadowVisible: false, headerRight: () => <UserMenu /> }
                            }
                        />
                    ))}
                </Stack>
            </View>
        </AppContextProvider>
    );
}
