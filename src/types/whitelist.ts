import { DeviceId } from "./devices";

interface AllowedDevice extends DeviceId {
    mac: string;
}

interface WhitelistRequest extends AllowedDevice {
    routerId: string;
}

export type CreateWhitelistRequest = WhitelistRequest;
export type DeleteWhitelistRequest = WhitelistRequest;
export type CreateWhitelistResponse = AllowedDevice;
export type DeleteWhitelistResponse = AllowedDevice;
