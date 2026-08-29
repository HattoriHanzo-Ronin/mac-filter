import { Picker } from "@react-native-picker/picker";
import { deviceForm } from "@/src/styles/components/style";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { ConnectionType, CreateDeviceRequest, Device, DeviceType } from "../types/devices";
import { DeviceFormProps, DeviceFormRequest, DeviceFormValues } from "../types/form";
import { ValidationErrors } from "../types/ui";
import UiUtils from "../utils/ui-utils";
import FormField from "./form-field";
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
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<DeviceFormValues>>({});
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<DeviceFormValues>({ defaultValues: device ? getDeviceValues(device) : DEFAULT_VALUES });
    const { fields, append, remove } = useFieldArray({ control, name: "connections" });
    const type = useWatch({ control, name: "type" });
    const connections = useWatch({ control, name: "connections" });

    function clearValidationError(field: keyof DeviceFormValues): void {
        setValidationErrors((current) => UiUtils.removeValidationError(current, field));
    }

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
        <ScrollView contentContainerStyle={deviceForm.form} keyboardShouldPersistTaps="handled">
            <FormField label={UiUtils.getDeviceLabel("name")} errors={validationErrors.name}>
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: "Requerido" }}
                    render={({ field: { onBlur, onChange, value } }) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={(text) => {
                                clearValidationError("name");
                                onChange(text);
                            }}
                            style={deviceForm.input}
                            value={value}
                        />
                    )}
                />
            </FormField>
            <FormField label={UiUtils.getDeviceLabel("type")} errors={validationErrors.type}>
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <View style={deviceForm.pickerContainer}>
                            <Picker
                                selectedValue={value}
                                onValueChange={(selectedType: DeviceType) => {
                                    clearValidationError("type");
                                    onChange(selectedType);
                                }}
                            >
                                {DEVICE_TYPES.map((deviceType) => (
                                    <Picker.Item
                                        key={deviceType}
                                        label={UiUtils.firstToUpper(deviceType)}
                                        value={deviceType}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                />
            </FormField>
            <FormField label={UiUtils.getDeviceLabel("model")} errors={validationErrors.model}>
                <Controller
                    control={control}
                    name="model"
                    render={({ field: { onBlur, onChange, value } }) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={(text) => {
                                clearValidationError("model");
                                onChange(text);
                            }}
                            style={deviceForm.input}
                            value={value}
                        />
                    )}
                />
            </FormField>
            <FormField label={UiUtils.getDeviceLabel("ip")} errors={validationErrors.ip}>
                <Controller
                    control={control}
                    name="ip"
                    render={({ field: { onBlur, onChange, value } }) => (
                        <TextInput
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={(text) => {
                                clearValidationError("ip");
                                onChange(text);
                            }}
                            style={deviceForm.input}
                            value={value}
                        />
                    )}
                />
            </FormField>
            {type === "ROUTER" && (
                <>
                    <FormField label={UiUtils.getDeviceLabel("mac_filter")} errors={validationErrors.mac_filter}>
                        <Controller
                            control={control}
                            name="mac_filter"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    onValueChange={(enabled) => {
                                        clearValidationError("mac_filter");
                                        onChange(enabled);
                                    }}
                                    value={value}
                                />
                            )}
                        />
                    </FormField>
                    <FormField label={UiUtils.getDeviceLabel("wifi_pass")} errors={validationErrors.wifi_pass}>
                        <Controller
                            control={control}
                            name="wifi_pass"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={(text) => {
                                        clearValidationError("wifi_pass");
                                        onChange(text);
                                    }}
                                    secureTextEntry
                                    style={deviceForm.input}
                                    value={value}
                                />
                            )}
                        />
                    </FormField>
                    <FormField label={UiUtils.getDeviceLabel("admin_pass")} errors={validationErrors.admin_pass}>
                        <Controller
                            control={control}
                            name="admin_pass"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={(text) => {
                                        clearValidationError("admin_pass");
                                        onChange(text);
                                    }}
                                    secureTextEntry
                                    style={deviceForm.input}
                                    value={value}
                                />
                            )}
                        />
                    </FormField>
                </>
            )}
            <View style={deviceForm.connectionsTitle}>
                <Text style={deviceForm.label}>{UiUtils.getDeviceLabel("connections")}</Text>
                <Pressable
                    disabled={connections.length === CONNECTION_TYPES.length}
                    onPress={addConnection}
                    style={deviceForm.addButton}
                >
                    <Text style={deviceForm.addButtonText}>+</Text>
                </Pressable>
            </View>
            {fields.map((field, index) => {
                const currentType = connections[index]?.ctype;
                const availableTypes = CONNECTION_TYPES.filter(
                    (connectionType) =>
                        connectionType === currentType ||
                        !connections.some((connection) => connection.ctype === connectionType)
                );
                return (
                    <View key={field.id} style={deviceForm.connection}>
                        <View style={deviceForm.connectionType}>
                            <Text style={deviceForm.label}>{UiUtils.getDeviceLabel("connection_type")}</Text>
                            <Controller
                                control={control}
                                name={`connections.${index}.ctype`}
                                render={({ field: { onChange, value } }) => (
                                    <View style={deviceForm.pickerContainer}>
                                        <Picker selectedValue={value} onValueChange={onChange}>
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
                            <Text style={deviceForm.label}>{UiUtils.getDeviceLabel("mac")}</Text>
                            <Controller
                                control={control}
                                name={`connections.${index}.mac`}
                                rules={{ required: "Requerido" }}
                                render={({ field: { onBlur, onChange, value } }) => (
                                    <TextInput
                                        autoCapitalize="characters"
                                        onBlur={onBlur}
                                        onChangeText={(text) => {
                                            clearValidationError("connections");
                                            onChange(text.replaceAll("-", ":").toUpperCase());
                                        }}
                                        style={deviceForm.input}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.connections?.[index]?.mac?.message && (
                                <Text style={deviceForm.error}>{errors.connections[index]?.mac?.message}</Text>
                            )}
                        </View>
                        <Pressable
                            accessibilityLabel="Eliminar conexión"
                            onPress={() => remove(index)}
                            style={deviceForm.removeButton}
                        >
                            <Text style={deviceForm.removeButtonText}>−</Text>
                        </Pressable>
                    </View>
                );
            })}
            <ValidationMessages errors={validationErrors.connections} />
            <Button
                disabled={isSubmitting}
                title={isSubmitting ? "Guardando..." : "Guardar"}
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
