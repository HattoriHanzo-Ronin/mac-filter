import { ApiErrorResponse } from "./api-response";
import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "./devices";

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
