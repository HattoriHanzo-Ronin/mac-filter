import { Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import type { Device, DevicePickerProps } from "../types/devices";
import UiUtils from "../utils/ui-utils";
import {
    commonComponents,
    commonComponentStyles,
    commonComponentsPalette
} from "@/src/styles/components/style";
import { useState } from "react";
import { useTheme } from "./theme-provider";


export default function DevicePicker(props: DevicePickerProps) {
    const { devices, selectedDeviceId, onSelect, style } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mode } = useTheme();
    const theme = commonComponentStyles[mode];
    const palette = commonComponentsPalette[mode];
    const selectedDevice = devices.find(({ id }) => id === selectedDeviceId);

    function selectDevice(device: Device): void {
        onSelect(device);
        setIsOpen(false);
    }

    return (
        <>
            <Pressable
                accessibilityRole="button"
                disabled={devices.length === 0}
                onPress={() => setIsOpen(true)}
                style={[commonComponents.pickerContainer, theme.pickerContainer, style]}
            >
                <Text numberOfLines={1} style={[commonComponents.picker, theme.picker]}>
                    {selectedDevice ? UiUtils.getDeviceDisplayName(selectedDevice.name, selectedDevice.model ?? "") : "Sin dispositivos"}
                </Text>
                <Ionicons color={palette.picker} name="chevron-down" size={18} />
            </Pressable>
            <Modal animationType="fade" onRequestClose={() => setIsOpen(false)} transparent visible={isOpen}>
                <Pressable style={commonComponents.pickerBackdrop} onPress={() => setIsOpen(false)}>
                    <View style={[commonComponents.pickerDialog, theme.pickerDialog]}>
                        <FlatList
                            data={devices}
                            keyExtractor={({ id }) => id}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => selectDevice(item)}
                                    style={({ pressed }) => [
                                        commonComponents.pickerOption,
                                        theme.pickerOption,
                                        item.id === selectedDeviceId && theme.selectedPickerOption,
                                        pressed && commonComponents.pickerOptionPressed
                                    ]}
                                >
                                    <Text numberOfLines={2} style={[commonComponents.pickerItem, theme.picker]}>
                                        {UiUtils.getDeviceDisplayName(item.name, item.model ?? "")}
                                    </Text>
                                    {item.id === selectedDeviceId && (
                                        <Ionicons color={palette.picker} name="checkmark" size={20} />
                                    )}
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
