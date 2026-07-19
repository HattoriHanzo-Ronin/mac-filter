import { Redirect } from "expo-router";
import { useEffect, useRef } from "react";

import { Animated, View } from "react-native";
import { useAppContext } from "../components/app-context-provider";
export default function Index() {
    const context = useAppContext();

    if (context.load) {
        return <IconBeat />;
    }

    return <Redirect href={"/main-app"} />;
}

const IconBeat = () => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.4,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, [scale]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.Image
                style={{ width: 200, height: 200, borderRadius: 100, transform: [{ scale }] }}
                source={require("@/assets/images/icon.png")}
            />
        </View>
    );
};
