import { useAppContext } from "@/src/components/app-context-provider";
import { DevicePicker, DeviceSearchInput } from "@/src/components/common-components";
import { Device } from "@/src/types/devices";
import { GetDevicesVersionResponse } from "@/src/types/version";
import ApiUtils from "@/src/utils/api-utils";
import UiUtils from "@/src/utils/ui-utils";
import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { index } from "@/src/styles/tab-nav-screens/style";

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
    const loadDevices = useCallback(async (): Promise<void> => {
        const result = await executeApiRequest((apiUtils) => apiUtils.getDevices());
        if (result.success) {
            const { data } = result;
            setDevices(data);
            selectDevice(data[0]);
        }
    }, [executeApiRequest, selectDevice, setDevices]);

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
        void loadDevices();
    }, [loadDevices]);

    useEffect(() => {
        const interval = setInterval(() => {
            void (async () => {
                if (!isLoading) {
                    const result = await executeApiRequest((apiUtils) => apiUtils.getVersion<GetDevicesVersionResponse>("devices"), true);
                    if (result.success && result.data.devices !== ApiUtils.DEVICES_VERSION) {
                        await loadDevices();
                    }
                }
            })();
        }, 5000);

        return () => clearInterval(interval);
    }, [executeApiRequest, isLoading, loadDevices]);

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <View style={index.screen}>
            <View style={index.parent}>
                <DevicePicker devices={devices} selectedDeviceId={deviceId} onSelect={selectDevice} />
                <DeviceSearchInput devices={devices} onSelect={selectDevice} />
                <FlatList
                    key={lastDevice?.id ?? "empty"}
                    style={index.scroll}
                    contentContainerStyle={[index.list, index.listContent]}
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
        </View>
    );
}
