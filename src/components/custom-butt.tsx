import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { useState } from "react";
import { customButt, customButtDynamic } from "@/src/styles/components/style";

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
            style={props.style ?? customButt.pressable}
            onTouchStart={() => {
                setColor("green");
                setOpacity(0.8);
            }}
            onTouchCancel={noTouch}
            onTouchEnd={noTouch}
            onPress={() => props.onPress()}
        >
            <View style={[customButt.background, customButtDynamic.background(opacity === 0.8)]}>
                <Text style={[customButt.label, customButtDynamic.label(color)]}>{props.label}</Text>
            </View>
        </Pressable>
    );
}
