import { Text } from "react-native";
import { validationMessages } from "@/src/styles/components/style";

export default function ValidationMessages({ errors }: { errors?: string[] }) {
    if (!errors) {
        return null;
    }

    return <Text style={validationMessages.error}>{errors.join("\n")}</Text>;
}
