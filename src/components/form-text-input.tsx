import { Controller, FieldValues } from "react-hook-form";
import { TextInput } from "react-native";
import type { FormTextInputProps } from "../types/form";

export default function FormTextInput<T extends FieldValues>(props: FormTextInputProps<T>) {
    const { control, name, onValueChange, transformValue, ...textInputProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                    {...textInputProps}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                        onValueChange?.();
                        onChange(transformValue ? transformValue(text) : text);
                    }}
                    value={value ?? ""}
                />
            )}
        />
    );
}
