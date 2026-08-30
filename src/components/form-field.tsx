import { Text, View } from "react-native";
import { formField } from "@/src/styles/components/style";
import ValidationMessages from "./validation-messages";
import type { FormFieldProps } from "../types/form";

export default function FormField(props: FormFieldProps) {
    return (
        <View style={[formField.field, props.horizontal && formField.horizontal]}>
            <Text style={[formField.label, props.labelStyle]}>{props.label}</Text>
            {props.children}
            <ValidationMessages errors={props.errors} />
        </View>
    );
}
