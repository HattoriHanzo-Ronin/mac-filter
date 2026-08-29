import { ActivityIndicator, Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { customButt } from "@/src/styles/components/style";

type CustomButtProps = {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

export default function CustomButt(props: CustomButtProps) {
    const { label, onPress, disabled = false, loading = false, style, buttonStyle, textStyle } = props;
    const isDisabled = disabled || loading;

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                customButt.pressable,
                style,
                isDisabled && customButt.disabled,
                pressed && customButt.pressed
            ]}
        >
            <View style={[customButt.background, buttonStyle]}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={[customButt.label, textStyle]}>{label}</Text>
                )}
            </View>
        </Pressable>
    );
}
