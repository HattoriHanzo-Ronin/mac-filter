import { useAppContext } from "@/src/components/app-context-provider";
import DevicePicker from "@/src/components/device-picker";
import DeviceSearchInput from "@/src/components/device-search-input";
import { Device, WifiPasswordDialogProps } from "@/src/types/devices";
import { GetDevicesVersionResponse } from "@/src/types/version";
import ApiUtils from "@/src/utils/api-utils";
import UiUtils from "@/src/utils/ui-utils";
import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, Pressable, Text, View, useColorScheme } from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { index, indexDark, indexLight } from "@/src/styles/tab-nav-screens/style";
import CustomButt from "@/src/components/custom-butt";
import ScreenBackground from "@/src/components/screen-background";
import LoadingWindow from "@/src/components/loading-window";

function WifiPasswordDialog({ password, visible, onClose }: WifiPasswordDialogProps) {
    const theme = useColorScheme() === "dark" ? indexDark : indexLight;

    async function copyPassword(): Promise<void> {
        await Clipboard.setStringAsync(password);
        UiUtils.showMessage("Contraseña copiada");
    }

    return (
        <Modal animationType="fade" onRequestClose={onClose} statusBarTranslucent transparent visible={visible}>
            <View style={index.qrBackdrop}>
                <View style={[index.qrDialog, theme.qrDialog]}>
                    <Text style={[index.qrHelperText, theme.valueProp]}>
                        Escanea el código para obtener la contraseña Wi-Fi.
                    </Text>
                    <View style={index.qrContainer}>
                        {password ? <QRCode backgroundColor="white" color="black" size={210} value={password} /> : null}
                    </View>
                    <View style={index.qrActions}>
                        <CustomButt buttonStyle={theme.qrCloseButton} label="Cerrar" onPress={onClose} style={index.qrAction} />
                        <CustomButt
                            buttonStyle={theme.primaryButton}
                            label="Copiar"
                            onPress={() => void copyPassword()}
                            style={index.qrAction}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function Index() {
    const theme = useColorScheme() === "dark" ? indexDark : indexLight;
    const { devices, lastDevice, setDevices, setLastDevice, executeApiRequest, isAuthenticated, isLoading } = useAppContext();
    const [deviceId, setDeviceId] = useState("");
    const [connectionTypeIndex, setConnectionTypeIndex] = useState(0);
    const [isWifiPasswordVisible, setIsWifiPasswordVisible] = useState(false);
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
        <ScreenBackground>
            <View style={[index.screen, theme.screen]}>
            <View style={index.parent}>
                <DevicePicker devices={devices} selectedDeviceId={deviceId} onSelect={selectDevice} style={index.controlSpacing} />
                <DeviceSearchInput devices={devices} onSelect={selectDevice} style={index.controlSpacing} />
                <FlatList
                    key={lastDevice?.id ?? "empty"}
                    style={index.scroll}
                    contentContainerStyle={[index.list, index.listContent]}
                    data={deviceProperties}
                    extraData={connectionTypeIndex}
                    initialNumToRender={deviceProperties.length}
                    ListFooterComponent={
                        <View style={index.listActions}>
                            <View style={index.parentButt}>
                                <CustomButt
                                    buttonStyle={index.dangerButton}
                                    disabled={isLoading}
                                    label="Borrar"
                                    onPress={deleteDevice}
                                    style={index.actionButton}
                                />
                                {lastDevice?.mac_filter && (
                                    <CustomButt
                                        buttonStyle={theme.primaryButton}
                                        disabled={isLoading}
                                        label="Filtro MAC"
                                        onPress={() => router.push("/mac-filter")}
                                        style={index.actionButton}
                                    />
                                )}
                                {lastDevice?.type === "ROUTER" && (
                                    <CustomButt
                                        buttonStyle={theme.primaryButton}
                                        disabled={isLoading}
                                        label="Administrar"
                                        onPress={() => router.push("/access-router")}
                                        style={index.actionButton}
                                    />
                                )}
                            </View>
                        </View>
                    }
                    maxToRenderPerBatch={deviceProperties.length}
                    removeClippedSubviews={false}
                    renderItem={({ item }) => (
                        <View style={[index.parentDevProp, theme.parentDevProp]}>
                            <Text style={[index.labelProp, theme.labelProp]}>{item.label}:</Text>
                            {item.key === "connection_type" ? (
                                <View style={index.connectionOptions}>
                                    {item.val.map((connectionType, connectionIndex) => (
                                        <Pressable
                                            key={connectionType}
                                            style={index.connectionOption}
                                            onPress={() => setConnectionTypeIndex(connectionIndex)}
                                        >
                                            <View style={[index.radioOuter, theme.radioOuter]}>
                                                {connectionTypeIndex === connectionIndex && <View style={[index.radioInner, theme.radioInner]} />}
                                            </View>
                                            <Text style={[index.connectionValue, theme.valueProp]}>{connectionType}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <View style={index.valueGroup}>
                                    <Text selectable style={[index.valueProp, theme.valueProp]}>
                                        {item.key === "mac" ? item.val[connectionTypeIndex] : item.val}
                                    </Text>
                                    {item.key === "wifi_pass" && (
                                        <Pressable hitSlop={8} onPress={() => setIsWifiPasswordVisible(true)}>
                                            <Text style={[index.qrLink, theme.qrLink]}>Mostrar QR</Text>
                                        </Pressable>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                    keyExtractor={(property) => property.key}
                />
            </View>
            </View>
            <LoadingWindow />
            <WifiPasswordDialog
                onClose={() => setIsWifiPasswordVisible(false)}
                password={lastDevice?.wifi_pass ?? ""}
                visible={isWifiPasswordVisible}
            />
        </ScreenBackground>
    );
}
