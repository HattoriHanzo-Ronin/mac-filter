import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import ValidationMessages from "./validation-messages";

export default function FormField(props: PropsWithChildren<{ errors?: string[]; label: string }>) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{props.label}</Text>
            {props.children}
            <ValidationMessages errors={props.errors} />
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        gap: 6
    },
    label: {
        fontSize: 16,
        fontWeight: "600"
    }
});
