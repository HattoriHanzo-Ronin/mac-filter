import { Text, View } from "react-native";
import { formField } from "@/src/styles/components/style";
import ValidationMessages from "./validation-messages";
import type { FormFieldProps } from "../types/form";

export default function FormField(props: FormFieldProps) {
    const { children, errors, horizontal, label, labelStyle } = props;

    return (
        <View style={[formField.field, horizontal && formField.horizontal]}>
            <Text style={[formField.label, labelStyle]}>{label}</Text>
            {children}
            <ValidationMessages errors={errors} />
        </View>
    );
}
