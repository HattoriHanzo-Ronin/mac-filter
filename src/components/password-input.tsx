import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import { passwordInput } from "@/src/styles/components/style";
import type { FormPasswordInputProps, PasswordInputProps } from "../types/form";

export default function PasswordInput(props: PasswordInputProps) {
    const { containerStyle, iconColor, inputStyle, leftIcon, style, ...textInputProps } = props;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={[passwordInput.container, containerStyle]}>
            {leftIcon && <Ionicons color={iconColor} name={leftIcon} size={20} />}
            <TextInput
                {...textInputProps}
                secureTextEntry={!isVisible}
                style={[passwordInput.input, style, inputStyle]}
            />
            <Pressable
                accessibilityLabel={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                hitSlop={8}
                onPress={() => setIsVisible((visible) => !visible)}
            >
                <Ionicons color={iconColor} name={isVisible ? "eye-off-outline" : "eye-outline"} size={20} />
            </Pressable>
        </View>
    );
}


export function FormPasswordInput<T extends FieldValues>(props: FormPasswordInputProps<T>) {
    const { control, name, onValueChange, ...passwordInputProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value } }) => (
                <PasswordInput
                    {...passwordInputProps}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                        onValueChange?.();
                        onChange(text);
                    }}
                    value={value ?? ""}
                />
            )}
        />
    );
}
