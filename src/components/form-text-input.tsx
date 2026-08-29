import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type FormTextInputProps<T extends FieldValues> = Omit<TextInputProps, "onBlur" | "onChangeText" | "value"> & {
    control: Control<T>;
    name: FieldPath<T>;
    onValueChange?: () => void;
    rules?: RegisterOptions<T, FieldPath<T>>;
    transformValue?: (value: string) => string;
};

export default function FormTextInput<T extends FieldValues>(props: FormTextInputProps<T>) {
    const { control, name, onValueChange, rules, transformValue, ...textInputProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
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
