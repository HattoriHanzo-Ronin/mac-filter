import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Device } from "../types/devices";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";
import { commonComponents } from "@/src/styles/components/style";

export const DevicePicker = (props: {
    devices: Device[];
    selectedDeviceId: string;
    onSelect: (device: Device) => void;
}) => {
    const { devices, selectedDeviceId, onSelect } = props;
    return (
        <View style={commonComponents.pickerContainer}>
            <Picker
                style={commonComponents.picker}
                selectedValue={selectedDeviceId}
                onValueChange={(deviceId) => {
                    const item = devices.find((device) => device.id === deviceId);
                    if (item) {
                        onSelect(item);
                    }
                }}
            >
                {devices.map((item) => (
                    <Picker.Item
                        style={commonComponents.pickerItem}
                        key={item.id}
                        value={item.id}
                        label={UiUtils.makeName(item.name, item.model ?? "")}
                    />
                ))}
            </Picker>
        </View>
    );
};

export const DeviceSearchInput = (props: { devices: Device[]; onSelect: (device: Device) => void }) => {
    const { isLoading } = useAppContext();
    const { devices, onSelect } = props;
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
        <View style={commonComponents.search}>
            <TextInput
                style={commonComponents.searchInput}
                value={text}
                onChangeText={setText}
                placeholder="Nombre o Mac"
                placeholderTextColor="black"
            />
            <View style={commonComponents.searchButton}>
                <Button disabled={isLoading} title="Buscar" onPress={search} />
            </View>
        </View>
    );
};
