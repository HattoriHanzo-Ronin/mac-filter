import DevicePicker from "@/src/components/device-picker";
import DeviceSearchInput from "@/src/components/device-search-input";
import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Button, FlatList, Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../components/app-context-provider";
import { macFilter, macFilterDynamic } from "@/src/styles/app/style";
import { Device } from "../types/devices";
import { GetFilteredDevicesVersionResponse } from "../types/version";
import ApiUtils from "../utils/api-utils";
import UiUtils from "../utils/ui-utils";

export default function MacFilter() {
    const { lastDevice, isAuthenticated, isLoading, executeApiRequest } = useAppContext();
    const routerId = lastDevice?.id;
    const safeTop = useSafeAreaInsets().top + (useWindowDimensions().height * 10) / 100;
    const safeBottom = useSafeAreaInsets().bottom + (useWindowDimensions().height * 6) / 100;
    const [showAllowed, setShowAllowed] = useState(true);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [selectedDevice, setSelectedDevice] = useState<Device>();
    const [connectionTypeIndex, setConnectionTypeIndex] = useState(0);
    const deviceProperties = selectedDevice
        ? UiUtils.mapDeviceProperties(selectedDevice).filter((property) =>
              ["name", "connection_type", "mac"].includes(property.key)
          )
        : [];
    const selectDevice = useCallback((device?: Device): void => {
        setSelectedDevice(device);
        setSelectedDeviceId(device?.id ?? "");
        setConnectionTypeIndex(0);
    }, []);
    const loadDevices = useCallback(async (): Promise<void> => {
        if (routerId) {
            const result = await executeApiRequest((apiUtils) =>
                showAllowed ? apiUtils.getAllowedDevices(routerId) : apiUtils.getNotAllowedDevices(routerId)
            );

            if (result.success) {
                const { data } = result;
                setDevices(data);
                selectDevice(data[0]);
            }
        }
    }, [executeApiRequest, routerId, selectDevice, showAllowed]);

    async function handleWhitelistPress(): Promise<void> {
        if (selectedDevice && routerId) {
            const { id: deviceId, connections } = selectedDevice;
            const connection = connections[connectionTypeIndex];
            if (!connection) {
                return;
            }

            const { mac } = connection;
            const result = await executeApiRequest((apiUtils) =>
                showAllowed
                    ? apiUtils.deleteWhitelist({ routerId, id: deviceId, mac })
                    : apiUtils.createWhitelist({ routerId, id: deviceId, mac })
            );

            if (result.success) {
                const { data } = result;
                const updatedDevices = devices.flatMap((device) => {
                    if (device.id !== data.id) {
                        return [device];
                    }

                    const remainingConnections = device.connections.filter(({ mac }) => mac !== data.mac);
                    return remainingConnections.length > 0 ? [{ ...device, connections: remainingConnections }] : [];
                });
                setDevices(updatedDevices);
                selectDevice(updatedDevices.find(({ id }) => id === data.id) ?? updatedDevices[0]);
            }
        }
    }

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            router.replace("/tab-nav-screens");
            return true;
        });

        return () => sub.remove();
    }, []);

    useEffect(() => {
        void loadDevices();
    }, [loadDevices]);

    useEffect(() => {
        const interval = setInterval(() => {
            void (async () => {
                if (!isLoading) {
                    const versions = await executeApiRequest(
                        (apiUtils) => apiUtils.getVersion<GetFilteredDevicesVersionResponse>("devices,whitelist"),
                        true
                    );
                    if (
                        versions.success &&
                        (versions.data.devices !== ApiUtils.DEVICES_VERSION ||
                            versions.data.whitelist !== ApiUtils.WHITELIST_VERSION)
                    ) {
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
        <View style={macFilter.screen}>
            <View style={[macFilter.parent, macFilterDynamic.safeArea(safeTop, safeBottom)]}>
                <Button
                    disabled={isLoading}
                    title={"Cambiar a " + (showAllowed ? "no permitidos" : "permitidos")}
                    onPress={() => setShowAllowed((showAllowed) => !showAllowed)}
                />
                <DevicePicker devices={devices} selectedDeviceId={selectedDeviceId} onSelect={selectDevice} />
                <DeviceSearchInput devices={devices} onSelect={selectDevice} />
                <FlatList
                    key={selectedDevice?.id ?? "empty"}
                    style={macFilter.scroll}
                    contentContainerStyle={[macFilter.list, macFilter.listContent]}
                    data={deviceProperties}
                    extraData={connectionTypeIndex}
                    initialNumToRender={deviceProperties.length}
                    maxToRenderPerBatch={deviceProperties.length}
                    removeClippedSubviews={false}
                    renderItem={({ item }) => (
                        <View style={macFilter.parentDevProp}>
                            <Text style={macFilter.labelProp}>{item.label}:</Text>
                            {item.key === "connection_type" ? (
                                <View style={macFilter.connectionOptions}>
                                    {item.val.map((connectionType, connectionIndex) => (
                                        <Pressable
                                            key={connectionType}
                                            style={macFilter.connectionOption}
                                            onPress={() => setConnectionTypeIndex(connectionIndex)}
                                        >
                                            <View style={macFilter.radioOuter}>
                                                {connectionTypeIndex === connectionIndex && <View style={macFilter.radioInner} />}
                                            </View>
                                            <Text style={macFilter.valueProp}>{connectionType}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <Text selectable style={macFilter.valueProp}>
                                    {item.key === "mac" ? item.val[connectionTypeIndex] : item.val}
                                </Text>
                            )}
                        </View>
                    )}
                    keyExtractor={(property) => property.key}
                />
                <Button disabled={isLoading} title={showAllowed ? "Quitar" : "Añadir"} onPress={handleWhitelistPress} />
            </View>
        </View>
    );
}
