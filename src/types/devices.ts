export type DeviceType = "CLIENT" | "ROUTER" | "SERVER";
export type ConnectionType = "WAN" | "LAN" | "WIFI";

interface DeviceConnection {
    mac: string;
    ctype: ConnectionType;
}

interface RouterCapabilities {
    addAllow: boolean;
    deleteAllow: boolean;
}

interface DeviceFields {
    name: string;
    connections: DeviceConnection[];
    model?: string | null;
    ip?: string | null;
    wifi_pass?: string | null;
    admin_pass?: string | null;
    mac_filter?: boolean | null;
}

export interface DeviceId {
    id: string;
}

export interface Device extends DeviceId, DeviceFields {
    type: DeviceType;
    capabilities?: RouterCapabilities;
}

export interface CreateDeviceRequest extends DeviceFields {
    type: DeviceType;
}

export interface UpdateDeviceRequest extends Partial<DeviceFields>, DeviceId {
    type?: DeviceType;
}

export type GetDevicesResponse = Device[];
export type GetDeviceResponse = Device;
export type GetAllowedDevicesResponse = Device[];
export type GetNotAllowedDevicesResponse = Device[];
export type CreateDeviceResponse = Device;
export type UpdateDeviceResponse = Device;
export type DeleteDeviceResponse = DeviceId;
