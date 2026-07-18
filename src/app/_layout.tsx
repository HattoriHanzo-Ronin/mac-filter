import { Slot } from "expo-router";
import AppContextProvider from "@/src/components/AppContextProvider";
import { BackHandler, ToastAndroid, View } from "react-native";
import { useEffect, useRef } from "react";

export default function RootLayout() {
    const lastTouch = useRef(0)

    useEffect(() => {

        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            const now = Date.now();
            // si el itnervalo ente los clicks es menor a 300ms
            if (lastTouch.current && now - lastTouch.current < 300) {
                BackHandler.exitApp()
            } else {
                lastTouch.current = now
                // creara un toast
                ToastAndroid.show('Presiona otra vez para salir', ToastAndroid.SHORT);
                // evita salir de la app en el primer click
                return true;
            }
        })

        // limpia el listener al desmontar
        return () => sub.remove();
    }, []);

    return (
        <AppContextProvider>
            <View  // obligara a que el fondo sea claro
                style={{ flex: 1, backgroundColor: "white" }}>
                <Slot />
            </View>
        </AppContextProvider>
    )
}