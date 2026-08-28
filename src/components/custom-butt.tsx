import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
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
            <View style={[styles.background, { backgroundColor: opacity === 0.8 ? "rgba(13, 158, 177, 0.8)" : "rgba(13, 158, 177, 0.4)" }]}>
                <Text style={{ color, textAlign: "center", fontSize: 19, fontWeight: "bold" }}>{props.label}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    }
});
