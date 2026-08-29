import { PropsWithChildren } from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";
import { formField } from "@/src/styles/components/style";
import ValidationMessages from "./validation-messages";

export default function FormField(props: PropsWithChildren<{ errors?: string[]; horizontal?: boolean; label: string; labelStyle?: StyleProp<TextStyle> }>) {
    return (
        <View style={[formField.field, props.horizontal && formField.horizontal]}>
            <Text style={[formField.label, props.labelStyle]}>{props.label}</Text>
            {props.children}
            <ValidationMessages errors={props.errors} />
        </View>
    );
}
