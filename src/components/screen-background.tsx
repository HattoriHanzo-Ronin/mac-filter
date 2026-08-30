import type { PropsWithChildren } from "react";
import { ImageBackground, useColorScheme } from "react-native";
import { screenBackground, screenBackgroundDark, screenBackgroundLight } from "@/src/styles/components/style";

export default function ScreenBackground(props: PropsWithChildren) {
    const theme = useColorScheme() === "dark" ? screenBackgroundDark : screenBackgroundLight;

    return (
        <ImageBackground
            imageStyle={theme.image}
            resizeMode="cover"
            source={require("@/assets/images/background.jpg")}
            style={[screenBackground.container, theme.container]}
        >
            {props.children}
        </ImageBackground>
    );
}
