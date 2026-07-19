import { PropsWithChildren } from "react";
import { ImageBackground } from "react-native";

export default function Background(props: PropsWithChildren<{ type?: string; opacity?: number }>) {
    if (props.type) {
        if (props.type === "tab") {
            return (
                <ImageBackground
                    imageStyle={{ opacity: 0.2, height: "15%", resizeMode: "cover" }}
                    source={require("@/assets/images/backTab.jpg")}
                    style={{ flex: 1 }}
                >
                    {props.children}
                </ImageBackground>
            );
        }

        if (props.type === "butt") {
            return (
                <ImageBackground
                    imageStyle={{ opacity: props.opacity ?? 0.4, resizeMode: "cover", borderRadius: 100 }}
                    source={require("@/assets/images/backTab.jpg")}
                    style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}
                >
                    {props.children}
                </ImageBackground>
            );
        }
    }

    return (
        <ImageBackground
            resizeMode="cover"
            imageStyle={{ opacity: 0.1, borderRadius: 200 }}
            source={require("@/assets/images/backNet.jpg")}
            style={{ flex: 1 }}
        >
            {props.children}
        </ImageBackground>
    );
}
