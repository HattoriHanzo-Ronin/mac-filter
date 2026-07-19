import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import Background from "./background";
import { useState } from "react";

export default function CustomButt(props: {
    label: string;
    onPress: () => void;
    disable?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    const [color, setColor] = useState("white");
    const [opacity, setOpacity] = useState(0.4);
    const noTouch = () => {
        setColor("white");
        setOpacity(0.4);
    };

    return (
        <Pressable
            disabled={props.disable}
            style={props.style ? props.style : { flex: 1 }}
            onTouchStart={() => {
                setColor("green");
                setOpacity(0.8);
            }}
            onTouchCancel={noTouch}
            onTouchEnd={noTouch}
            onPress={() => props.onPress()}
        >
            <Background type="butt" opacity={opacity}>
                <Text style={{ color: color, textAlign: "center", fontSize: 19, fontWeight: "bold" }}>
                    {props.label}
                </Text>
            </Background>
        </Pressable>
    );
}
