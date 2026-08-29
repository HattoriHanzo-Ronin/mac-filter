import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { Pressable, StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { passwordInput } from "@/src/styles/components/style";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
    containerStyle?: StyleProp<ViewStyle>;
    iconColor: string;
    inputStyle?: StyleProp<TextStyle>;
    leftIcon?: "lock-closed-outline";
};

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

type FormPasswordInputProps<T extends FieldValues> = Omit<
    PasswordInputProps,
    "onBlur" | "onChangeText" | "value"
> & {
    control: Control<T>;
    name: FieldPath<T>;
    onValueChange?: () => void;
    rules?: RegisterOptions<T, FieldPath<T>>;
};

export function FormPasswordInput<T extends FieldValues>(props: FormPasswordInputProps<T>) {
    const { control, name, onValueChange, rules, ...passwordInputProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
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
