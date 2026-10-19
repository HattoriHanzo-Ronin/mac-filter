import type { PropsWithChildren } from "react";
import { ImageBackground } from "react-native";
import { screenBackground, screenBackgroundStyles } from "@/src/styles/components/style";
import { useTheme } from "./theme-provider";

export default function ScreenBackground(props: PropsWithChildren) {
    const { mode } = useTheme();
    const theme = screenBackgroundStyles[mode];

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
