import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { customButton } from "@/src/styles/components/style";
import type { CustomButtonProps } from "../types/ui";

export default function CustomButton(props: CustomButtonProps) {
    const { label, onPress, disabled = false, loading = false, style, buttonStyle, textStyle } = props;
    const isDisabled = disabled || loading;

    return (
        <Pressable
            accessibilityRole="button"
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                customButton.pressable,
                style,
                isDisabled && customButton.disabled,
                pressed && customButton.pressed
            ]}
        >
            <View style={[customButton.background, buttonStyle]}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={[customButton.label, textStyle]}>{label}</Text>
                )}
            </View>
        </Pressable>
    );
}
