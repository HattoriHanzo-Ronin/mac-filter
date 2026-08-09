import { StyleSheet, Text } from "react-native";

export default function ValidationMessages({ errors }: { errors?: string[] }) {
    if (!errors) {
        return null;
    }

    return <Text style={styles.error}>{errors.join("\n")}</Text>;
}

const styles = StyleSheet.create({
    error: {
        color: "red"
    }
});
