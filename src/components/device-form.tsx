import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
    deviceForm,
    deviceFormDark,
    deviceFormDynamic,
    deviceFormLight,
    deviceFormPalette
} from "@/src/styles/components/style";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Pressable, ScrollView, Switch, Text, View, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConnectionType, CreateDeviceRequest, Device, DeviceType } from "../types/devices";
import { DeviceFormProps, DeviceFormRequest, DeviceFormValues } from "../types/form";
import { ValidationErrors } from "../types/ui";
import UiUtils from "../utils/ui-utils";
import CustomButt from "./custom-butt";
import FormField from "./form-field";
import FormTextInput from "./form-text-input";
import { FormPasswordInput } from "./password-input";
import ValidationMessages from "./validation-messages";

const CONNECTION_TYPES: ConnectionType[] = ["WAN", "LAN", "WIFI"];
const DEVICE_TYPES: DeviceType[] = ["CLIENT", "ROUTER", "SERVER"];

const DEFAULT_VALUES: DeviceFormValues = {
    name: "",
    type: "CLIENT",
    connections: [],
    model: "",
    ip: "",
    wifi_pass: "",
    admin_pass: "",
    mac_filter: false
};

export default function DeviceForm({ device, onSubmit }: DeviceFormProps) {
    const isDark = useColorScheme() === "dark";
    const safeBottom = useSafeAreaInsets().bottom;
    const theme = isDark ? deviceFormDark : deviceFormLight;
    const palette = isDark ? deviceFormPalette.dark : deviceFormPalette.light;
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<DeviceFormValues>>({});
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<DeviceFormValues>({ defaultValues: device ? getDeviceValues(device) : DEFAULT_VALUES });
    const { fields, append, remove } = useFieldArray({ control, name: "connections" });
    const type = useWatch({ control, name: "type" });
    const connections = useWatch({ control, name: "connections" });

    async function submitForm(values: DeviceFormValues): Promise<void> {
        const errorResponse = await onSubmit(getRequest(values, device));
        if (errorResponse) {
            const { error } = errorResponse;
            setValidationErrors(error.details ? UiUtils.mapValidationErrors<DeviceFormValues>(error.details) : {});
            return;
        }

        setValidationErrors({});
        if (!device) {
            reset();
        }
    }

    function addConnection(): void {
        const connectionType = CONNECTION_TYPES.find(
            (connectionType) => !connections.some((connection) => connection.ctype === connectionType)
        );
        if (connectionType) {
            append({ ctype: connectionType, mac: "" });
        }
    }

    useEffect(() => {
        if (device) {
            reset(getDeviceValues(device));
        }
    }, [device, reset]);

    return (
        <ScrollView
            contentContainerStyle={[deviceForm.form, deviceFormDynamic.form(safeBottom)]}
            keyboardShouldPersistTaps="handled"
            style={[deviceForm.screen, theme.screen]}
        >
            <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("name")} errors={validationErrors.name}>
                <FormTextInput
                    control={control}
                    name="name"
                    onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "name")}
                    style={[deviceForm.input, theme.input]}
                />
            </FormField>
            <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("type")} errors={validationErrors.type}>
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <View style={[deviceForm.pickerContainer, theme.pickerContainer]}>
                            <Picker
                                dropdownIconColor={palette.picker}
                                selectedValue={value}
                                style={theme.input}
                                onValueChange={(selectedType: DeviceType) => {
                                    UiUtils.clearValidationError(setValidationErrors, "type");
                                    onChange(selectedType);
                                }}
                            >
                                {DEVICE_TYPES.map((deviceType) => (
                                    <Picker.Item
                                        key={deviceType}
                                        label={UiUtils.getDeviceTypeLabel(deviceType)}
                                        value={deviceType}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                />
            </FormField>
            <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("model")} errors={validationErrors.model}>
                <FormTextInput
                    control={control}
                    name="model"
                    onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "model")}
                    style={[deviceForm.input, theme.input]}
                />
            </FormField>
            <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("ip")} errors={validationErrors.ip}>
                <FormTextInput
                    control={control}
                    keyboardType="numeric"
                    name="ip"
                    onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "ip")}
                    style={[deviceForm.input, theme.input]}
                />
            </FormField>
            {type === "ROUTER" && (
                <>
                    <FormField
                        horizontal
                        labelStyle={theme.label}
                        label={UiUtils.getDeviceLabel("mac_filter")}
                        errors={validationErrors.mac_filter}
                    >
                        <Controller
                            control={control}
                            name="mac_filter"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    thumbColor={palette.switch}
                                    trackColor={{ false: "#777", true: palette.switch }}
                                    onValueChange={(enabled) => {
                                        UiUtils.clearValidationError(setValidationErrors, "mac_filter");
                                        onChange(enabled);
                                    }}
                                    value={value}
                                />
                            )}
                        />
                    </FormField>
                    <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("wifi_pass")} errors={validationErrors.wifi_pass}>
                        <FormPasswordInput
                            containerStyle={[deviceForm.passwordInput, theme.input]}
                            control={control}
                            iconColor={palette.icon}
                            inputStyle={[deviceForm.passwordTextInput, theme.passwordTextInput]}
                            name="wifi_pass"
                            onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "wifi_pass")}
                        />
                    </FormField>
                    <FormField labelStyle={theme.label} label={UiUtils.getDeviceLabel("admin_pass")} errors={validationErrors.admin_pass}>
                        <FormPasswordInput
                            containerStyle={[deviceForm.passwordInput, theme.input]}
                            control={control}
                            iconColor={palette.icon}
                            inputStyle={[deviceForm.passwordTextInput, theme.passwordTextInput]}
                            name="admin_pass"
                            onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "admin_pass")}
                        />
                    </FormField>
                </>
            )}
            <View style={deviceForm.connectionsTitle}>
                <Text style={[deviceForm.label, theme.label]}>{UiUtils.getDeviceLabel("connections")}</Text>
            </View>
            <Pressable
                disabled={connections.length === CONNECTION_TYPES.length}
                onPress={addConnection}
                style={deviceForm.addRowButton}
            >
                <Ionicons color={palette.icon} name="add" size={20} />
                <Text style={[deviceForm.addRowText, theme.accentText]}>Añadir fila</Text>
            </Pressable>
            {fields.map((field, index) => {
                const currentType = connections[index]?.ctype;
                const availableTypes = CONNECTION_TYPES.filter(
                    (connectionType) =>
                        connectionType === currentType ||
                        !connections.some((connection) => connection.ctype === connectionType)
                );
                return (
                    <View
                        key={field.id}
                        style={[
                            deviceForm.connection,
                            index < fields.length - 1 && theme.connectionSeparator
                        ]}
                    >
                        <View style={deviceForm.connectionType}>
                            <Text style={[deviceForm.label, deviceForm.connectionTypeLabel, theme.label]}>
                                {UiUtils.getDeviceLabel("connection_type")}
                            </Text>
                            <Controller
                                control={control}
                                name={`connections.${index}.ctype`}
                                render={({ field: { onChange, value } }) => (
                                    <View style={[deviceForm.pickerContainer, deviceForm.connectionTypeValue, theme.pickerContainer]}>
                                        <Picker
                                            dropdownIconColor={palette.picker}
                                            selectedValue={value}
                                            style={theme.input}
                                            onValueChange={onChange}
                                        >
                                            {availableTypes.map((connectionType) => (
                                                <Picker.Item
                                                    key={connectionType}
                                                    label={UiUtils.firstToUpper(connectionType)}
                                                    value={connectionType}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                )}
                            />
                        </View>
                        <View style={deviceForm.connectionMac}>
                            <Text style={[deviceForm.label, deviceForm.connectionMacLabel, theme.label]}>
                                {UiUtils.getDeviceLabel("mac")}
                            </Text>
                            <View style={deviceForm.connectionMacValue}>
                                <FormTextInput
                                    autoCapitalize="characters"
                                    control={control}
                                    name={`connections.${index}.mac`}
                                    onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "connections")}
                                    style={[deviceForm.input, theme.input]}
                                    transformValue={(text) => text.replaceAll("-", ":").toUpperCase()}
                                />
                            </View>
                        </View>
                        <Pressable
                            accessibilityLabel="Eliminar conexión"
                            onPress={() => remove(index)}
                            style={deviceForm.removeButton}
                        >
                            <Ionicons color={palette.remove} name="trash-outline" size={20} />
                        </Pressable>
                    </View>
                );
            })}
            <ValidationMessages errors={validationErrors.connections} />
            <CustomButt
                buttonStyle={theme.primaryButton}
                disabled={isSubmitting}
                label={device ? "Guardar cambios" : "Guardar dispositivo"}
                loading={isSubmitting}
                onPress={handleSubmit(submitForm)}
            />
        </ScrollView>
    );
}

function getDeviceValues(device: Device): DeviceFormValues {
    return {
        name: device.name,
        type: device.type,
        connections: device.connections,
        model: device.model ?? "",
        ip: device.ip ?? "",
        wifi_pass: device.wifi_pass ?? "",
        admin_pass: device.admin_pass ?? "",
        mac_filter: device.mac_filter ?? false
    };
}

function getRequest(values: DeviceFormValues, device?: Device | null): DeviceFormRequest {
    const request: CreateDeviceRequest = {
        name: values.name.trim(),
        type: values.type,
        connections: values.connections,
        model: values.model || undefined,
        ip: values.ip || undefined
    };
    if (values.type === "ROUTER") {
        request.mac_filter = values.mac_filter;
        request.wifi_pass = values.wifi_pass || undefined;
        request.admin_pass = values.admin_pass || undefined;
    }

    return device ? { ...request, id: device.id } : request;
}
