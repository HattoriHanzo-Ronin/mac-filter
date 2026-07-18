import { Redirect } from 'expo-router';
import { useEffect, useRef } from 'react';

import { Animated, View } from "react-native";
import { useAppContext } from '../components/AppContextProvider';
// redirigira a Ej1
export default function Index() {
    const context = useAppContext()

    // si aun esta cargando la api mostrara un load
    if (context.load) {
        {
            return <IconBeat />;
        }
    }
    return <Redirect href={"/mainApp"} />;
}

// mostrara el icono latiendo
const IconBeat = () => {
    const scale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // Animación infinita de latido
        Animated.loop(
            Animated.sequence([
                // aumenta el tamaño
                Animated.timing(scale, {
                    toValue: 1.4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                // vuelve a tamaño normal
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scale]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.Image style={{ width: 200, height: 200, borderRadius: 100, transform: [{ scale }] }} source={require("@/assets/images/icon.png")} />
        </View>
    )
}