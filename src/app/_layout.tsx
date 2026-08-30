import { Stack } from "expo-router";
import AppContextProvider from "@/src/components/app-context-provider";
import UserMenu from "./_user-menu";
import { rootLayout, rootLayoutDark, rootLayoutLight } from "@/src/styles/app/style";
import { BackHandler, ToastAndroid, View, useColorScheme } from "react-native";
import { useEffect, useRef } from "react";

export default function RootLayout() {
    const lastTouch = useRef(0);
    const isDark = useColorScheme() === "dark";
    const navigationTheme = isDark ? rootLayoutDark : rootLayoutLight;
    const defaultScreenOptions = {
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: navigationTheme.header,
        headerTintColor: navigationTheme.headerTint.color,
        headerTitleStyle: { color: navigationTheme.headerTint.color },
        statusBarStyle: isDark ? ("light" as const) : ("dark" as const),
        statusBarBackgroundColor: navigationTheme.header.backgroundColor,
        headerRight: () => <UserMenu />
    };
    const screens = [
        { name: "index", options: { headerShown: false } },
        { name: "tab-nav-screens", options: { headerBackVisible: false } },
        { name: "mac-filter" },
        { name: "access-router" }
    ];

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            const now = Date.now();
            if (lastTouch.current && now - lastTouch.current < 1000) {
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
                            options={{ ...defaultScreenOptions, ...options }}
                        />
                    ))}
                </Stack>
            </View>
        </AppContextProvider>
    );
}
