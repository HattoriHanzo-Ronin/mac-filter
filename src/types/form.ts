import type { PropsWithChildren } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
import type { ApiErrorResponse } from "./api-response";
import type { CreateDeviceRequest, Device, UpdateDeviceRequest } from "./devices";

export type FormTextInputProps<T extends FieldValues> = Omit<
    TextInputProps,
    "onBlur" | "onChangeText" | "value"
> & {
    control: Control<T>;
    name: FieldPath<T>;
    onValueChange?: () => void;
    transformValue?: (value: string) => string;
};

export type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
    containerStyle?: StyleProp<ViewStyle>;
    iconColor: string;
    inputStyle?: StyleProp<TextStyle>;
    leftIcon?: "lock-closed-outline";
};

export type FormPasswordInputProps<T extends FieldValues> = Omit<
    PasswordInputProps,
    "onBlur" | "onChangeText" | "value"
> & {
    control: Control<T>;
    name: FieldPath<T>;
    onValueChange?: () => void;
};

export type FormFieldProps = PropsWithChildren<{
    errors?: string[];
    horizontal?: boolean;
    label: string;
    labelStyle?: StyleProp<TextStyle>;
}>;

export type DeviceFormValues = Omit<
    CreateDeviceRequest,
    "model" | "ip" | "wifi_pass" | "admin_pass" | "mac_filter"
> & {
    model: string;
    ip: string;
    wifi_pass: string;
    admin_pass: string;
    mac_filter: boolean;
};

export type DeviceFormRequest = CreateDeviceRequest | UpdateDeviceRequest;

export type DeviceFormProps = {
    device?: Device | null;
    onSubmit: (data: DeviceFormRequest) => Promise<ApiErrorResponse | undefined>;
};
