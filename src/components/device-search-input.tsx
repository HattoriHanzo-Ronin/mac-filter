import { useState } from "react";
import { StyleProp, TextInput, View, ViewStyle, useColorScheme } from "react-native";
import { Device } from "../types/devices";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";
import CustomButt from "./custom-butt";
import {
    commonComponents,
    commonComponentsDark,
    commonComponentsLight,
    commonComponentsPalette
} from "@/src/styles/components/style";

type DeviceSearchInputProps = {
    devices: Device[];
    onSelect: (device: Device) => void;
    style?: StyleProp<ViewStyle>;
};

export default function DeviceSearchInput({ devices, onSelect, style }: DeviceSearchInputProps) {
    const isDark = useColorScheme() === "dark";
    const theme = isDark ? commonComponentsDark : commonComponentsLight;
    const palette = isDark ? commonComponentsPalette.dark : commonComponentsPalette.light;
    const { isLoading } = useAppContext();
    const [text, setText] = useState("");

    function search(): void {
        const normalize = (value: string) => value.toUpperCase();
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
                onChangeText={setText}
                placeholder="Nombre o MAC"
                placeholderTextColor={palette.placeholder}
                style={[commonComponents.searchInput, theme.searchInput]}
                value={text}
            />
            <View style={commonComponents.searchButton}>
                <CustomButt disabled={isLoading} label="Buscar" onPress={search} />
            </View>
        </View>
    );
}
