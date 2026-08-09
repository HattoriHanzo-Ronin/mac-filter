import { useAppContext } from "@/src/components/app-context-provider";
import Background from "@/src/components/background";
import { DevicePicker, DeviceSearchInput } from "@/src/components/common-components";
import { Device } from "@/src/types/devices";
import UiUtils from "@/src/utils/ui-utils";
import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { index } from "../../styles";

export default function Index() {
    const { devices, lastDevice, setDevices, setLastDevice, executeApiRequest, isAuthenticated, isLoading } = useAppContext();
    const [deviceId, setDeviceId] = useState("");
    const [connectionTypeIndex, setConnectionTypeIndex] = useState(0);
    const deviceProperties = lastDevice ? UiUtils.mapDeviceProperties(lastDevice) : [];

    const selectDevice = useCallback((device?: Device): void => {
        setLastDevice(device ?? null);
        setDeviceId(device?.id ?? "");
        setConnectionTypeIndex(0);
    }, [setLastDevice]);

    async function deleteDevice(): Promise<void> {
        if (lastDevice) {
            const result = await executeApiRequest((apiUtils) => apiUtils.deleteDevice(lastDevice.id));
            if (result.success) {
                const { id: deletedId } = result.data;
                const updatedDevices = devices.filter(({ id }) => id !== deletedId);
                setDevices(updatedDevices);
                selectDevice(updatedDevices[0]);
            }
        }
    }

    useEffect(() => {
        void (async () => {
            const result = await executeApiRequest((apiUtils) => apiUtils.getDevices());
            if (result.success) {
                const { data } = result;
                setDevices(data);
                selectDevice(data[0]);
            }
        })();
    }, [executeApiRequest, selectDevice, setDevices]);

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <Background>
            <View style={index.parent}>
                <DevicePicker devices={devices} selectedDeviceId={deviceId} onSelect={selectDevice} />
                <DeviceSearchInput devices={devices} onSelect={selectDevice} />
                <FlatList
                    key={lastDevice?.id ?? "empty"}
                    style={index.scroll}
                    contentContainerStyle={[index.list, { paddingBottom: "2%" }]}
                    data={deviceProperties}
                    extraData={connectionTypeIndex}
                    initialNumToRender={deviceProperties.length}
                    ListFooterComponent={<View style={index.listFooter} />}
                    maxToRenderPerBatch={deviceProperties.length}
                    removeClippedSubviews={false}
                    renderItem={({ item }) => (
                        <View style={index.parentDevProp}>
                            <Text style={index.labelProp}>{item.label}:</Text>
                            {item.key === "connection_type" ? (
                                <View style={index.connectionOptions}>
                                    {item.val.map((connectionType, connectionIndex) => (
                                        <Pressable
                                            key={connectionType}
                                            style={index.connectionOption}
                                            onPress={() => setConnectionTypeIndex(connectionIndex)}
                                        >
                                            <View style={index.radioOuter}>
                                                {connectionTypeIndex === connectionIndex && <View style={index.radioInner} />}
                                            </View>
                                            <Text style={index.valueProp}>{connectionType}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <Text selectable style={index.valueProp}>
                                    {item.key === "mac" ? item.val[connectionTypeIndex] : item.val}
                                </Text>
                            )}
                        </View>
                    )}
                    keyExtractor={(property) => property.key}
                />
                <View style={index.parentButt}>
                    <Button disabled={isLoading} title="Borrar" onPress={deleteDevice} />
                    {lastDevice?.mac_filter && (
                        <Button disabled={isLoading} title="Filtro mac" onPress={() => router.push("/mac-filter")} />
                    )}
                    {lastDevice?.type === "ROUTER" && (
                        <Button
                            disabled={isLoading}
                            title="Administrar"
                            onPress={() => router.push("/access-router")}
                        />
                    )}
                </View>
            </View>
        </Background>
    );
}
