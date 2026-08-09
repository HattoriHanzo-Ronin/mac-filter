import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Device } from "../types/devices";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";

export const DevicePicker = (props: {
    devices: Device[];
    selectedDeviceId: string;
    onSelect: (device: Device) => void;
}) => {
    const { devices, selectedDeviceId, onSelect } = props;
    return (
        <View style={{ borderWidth: 0.7, borderRadius: 100, borderStyle: "dashed" }}>
            <Picker
                style={{ color: "black" }}
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
                        style={{ fontSize: 20, fontWeight: "bold" }}
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
        <View style={{ flexDirection: "row", gap: "2%" }}>
            <TextInput
                style={{ flex: 1, borderWidth: 1, padding: 10 }}
                value={text}
                onChangeText={setText}
                placeholder="Nombre o Mac"
                placeholderTextColor="black"
            />
            <View style={{ width: "30%" }}>
                <Button disabled={isLoading} title="Buscar" onPress={search} />
            </View>
        </View>
    );
};
