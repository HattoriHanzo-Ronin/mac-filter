import { PropsWithChildren } from "react"
import { ImageBackground } from "react-native"

// componente para el fondo de pantalla
export default function Background (props: PropsWithChildren<{ type?: string, opacity?: number }>) {
        // si se recibe un tipo de background
        if (props.type) {
            // si ese tipo es tab
            if (props.type === "tab") {
                return (
                    <ImageBackground imageStyle={{ opacity: 0.2, height: "15%", resizeMode: "cover" }} source={require("@/assets/images/backTab.jpg")} style={{ flex: 1 }}>
                        {props.children}
                    </ImageBackground>)
            }
            if (props.type === "butt") {
                return (
                    <ImageBackground imageStyle={{ opacity: props.opacity ?? 0.4, resizeMode: "cover", borderRadius: 100 }} source={require("@/assets/images/backTab.jpg")} 
                    style={{width: "100%", height: 50, justifyContent: "center", alignItems: "center"}} >
                        {props.children}
                    </ImageBackground>)
            }
        }
        // sino por defecto usara este background
        return (
            <ImageBackground resizeMode="cover" imageStyle={{ opacity: 0.1, borderRadius: 200}} source={require("@/assets/images/backNet.jpg")} style={{ flex: 1 }}>
                {props.children}
            </ImageBackground>)
    }