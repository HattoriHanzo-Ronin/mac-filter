export interface GetDevicesVersionResponse {
    devices: string;
}

export interface GetFilteredDevicesVersionResponse extends GetDevicesVersionResponse {
    whitelist: string;
}
