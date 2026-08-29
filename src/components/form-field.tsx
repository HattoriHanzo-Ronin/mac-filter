import { PropsWithChildren } from "react";
import { formField } from "@/src/styles/components/style";
import { Text, View } from "react-native";
import ValidationMessages from "./validation-messages";

export default function FormField(props: PropsWithChildren<{ errors?: string[]; label: string }>) {
    return (
        <View style={formField.field}>
            <Text style={formField.label}>{props.label}</Text>
            {props.children}
            <ValidationMessages errors={props.errors} />
        </View>
    );
}
