import { Text } from "react-native";
import { validationMessages } from "@/src/styles/components/style";
import type { ValidationMessagesProps } from "../types/ui";

export default function ValidationMessages({ errors }: ValidationMessagesProps) {
    if (!errors) {
        return null;
    }

    return <Text style={validationMessages.error}>{errors.join("\n")}</Text>;
}
