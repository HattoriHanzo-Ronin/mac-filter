import { ToastAndroid } from "react-native";
import { ApiValidationErrorDetail } from "../types/api-error";
import { Device } from "../types/devices";
import {
    DeviceDisplayProperty,
    DeviceLabelKey,
    DeviceScalarPropertyKey,
    MessageDuration,
    ValidationErrors
} from "../types/ui";

/**
 * UI utilities
 *
 * @author HattoriHanzo-Ronin
 */
export default class UiUtils {
    private static readonly DEVICE_TYPE_LABELS: Record<Device["type"], string> = {
        CLIENT: "Cliente",
        ROUTER: "Router",
        SERVER: "Servidor"
    };
    private static readonly DEVICE_LABELS: Record<DeviceLabelKey, string> = {
        name: "Nombre",
        type: "Tipo",
        connections: "Conexiones",
        connection_type: "Tipo de conexión",
        mac: "MAC",
        model: "Modelo",
        ip: "IP",
        wifi_pass: "Contraseña Wi-Fi",
        admin_pass: "Contraseña de administración",
        mac_filter: "Filtro MAC"
    };

    /**
     * Returns a device display name
     *
     * @param name Device name
     * @param type Device type
     * @returns Device display name
     */
    static makeName(name: string, type: string): string {
        return `${name} ${type !== "" ? `( ${type} )` : ""}`;
    }

    /**
     * Returns a value with its first character in uppercase
     *
     * @param value Value to transform
     * @returns Transformed value
     */
    static firstToUpper(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    /**
     * Returns a device label
     *
     * @param key Device label key
     * @returns Device label
     */
    static getDeviceLabel(key: DeviceLabelKey): string {
        return this.DEVICE_LABELS[key];
    }

    /**
     * Displays a message
     *
     * @param message Message
     * @param duration Display duration
     */
    static showMessage(message: string, duration: MessageDuration = "LONG"): void {
        ToastAndroid.show(message, duration === "LONG" ? ToastAndroid.LONG : ToastAndroid.SHORT);
    }

    /**
     * Maps API validation details to the corresponding form fields
     *
     * @param details API validation details
     * @returns Validation messages keyed by form field
     */
    static mapValidationErrors<T extends object>(details: ApiValidationErrorDetail[]): ValidationErrors<T> {
        const validationErrors: ValidationErrors<T> = {};
        for (const { field, message } of details) {
            if (field) {
                const key = field as keyof T;
                validationErrors[key] = [...(validationErrors[key] ?? []), `- ${message}`];
            }
        }
        return validationErrors;
    }

    /**
     * Removes the validation errors for a form field
     *
     * @param validationErrors Form validation errors
     * @param field Form field
     * @returns Validation errors without the specified field
     */
    static removeValidationError<T extends object>(
        validationErrors: ValidationErrors<T>,
        field: keyof T
    ): ValidationErrors<T> {
        const updatedErrors = { ...validationErrors };
        delete updatedErrors[field];
        return updatedErrors;
    }

    /**
     * Maps a device to labeled display properties
     *
     * @param device Device
     * @returns Device display properties
     */
    static mapDeviceProperties(device: Device): DeviceDisplayProperty[] {
        const properties: DeviceDisplayProperty[] = [
            { key: "name", label: this.getDeviceLabel("name"), val: device.name },
            { key: "type", label: this.getDeviceLabel("type"), val: this.DEVICE_TYPE_LABELS[device.type] }
        ];
        this.addDeviceProperty(properties, "model", this.getDeviceLabel("model"), device.model);
        if (device.connections.length > 0) {
            properties.push({
                key: "connection_type",
                label: this.getDeviceLabel("connection_type"),
                val: device.connections.map((connection) => this.firstToUpper(connection.ctype))
            });
            properties.push({
                key: "mac",
                label: this.getDeviceLabel("mac"),
                val: device.connections.map((connection) => connection.mac)
            });
        }

        this.addDeviceProperty(properties, "ip", this.getDeviceLabel("ip"), device.ip);
        this.addDeviceProperty(properties, "wifi_pass", this.getDeviceLabel("wifi_pass"), device.wifi_pass);
        this.addDeviceProperty(
            properties,
            "mac_filter",
            this.getDeviceLabel("mac_filter"),
            device.mac_filter === null || device.mac_filter === undefined
                ? undefined
                : device.mac_filter
                  ? "Activado"
                  : "Desactivado"
        );
        return properties;
    }

    private static addDeviceProperty(
        properties: DeviceDisplayProperty[],
        key: DeviceScalarPropertyKey,
        label: string,
        val?: string | null
    ): void {
        if (val !== null && val !== undefined) {
            properties.push({ key, label, val });
        }
    }
}
