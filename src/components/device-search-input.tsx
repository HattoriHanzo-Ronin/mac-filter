import { useState } from "react";
import { TextInput, View } from "react-native";
import type { DeviceSearchInputProps } from "../types/devices";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";
import CustomButton from "./custom-button";
import {
    commonComponents,
    commonComponentStyles,
    commonComponentsPalette
} from "@/src/styles/components/style";
import { useTheme } from "./theme-provider";


export default function DeviceSearchInput(props: DeviceSearchInputProps) {
    const { devices, onSelect, style } = props;
    const { mode } = useTheme();
    const theme = commonComponentStyles[mode];
    const palette = commonComponentsPalette[mode];
    const { isLoading } = useAppContext();
    const [text, setText] = useState<string>("");

    function search(): void {
        const normalize = (value: string) => value.toUpperCase().replaceAll("-", ":");
        const normalizedText = normalize(text);
        const matchingDevice = devices.find(
            ({ name, connections }) =>
                normalize(name) === normalizedText ||
                connections.some(({ mac }) => normalize(mac) === normalizedText)
        );
        if (matchingDevice) {
            onSelect(matchingDevice);
        } else {
            UiUtils.showMessage("No se ha encontrado resultado");
        }
        setText("");
    }

    return (
        <View style={[commonComponents.search, style]}>
            <TextInput
                accessibilityLabel="Buscar por nombre o MAC"
                onChangeText={setText}
                placeholder="Nombre o MAC"
                placeholderTextColor={palette.placeholder}
                style={[commonComponents.searchInput, theme.searchInput]}
                value={text}
            />
            <View style={commonComponents.searchButton}>
                <CustomButton disabled={isLoading} label="Buscar" onPress={search} />
            </View>
        </View>
    );
}
