import axios, { isAxiosError } from "axios";
import ApiUtils from "../../src/utils/api-utils";
import { LoginResponse } from "../../src/types/auth";
import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "../../src/types/devices";
import { GetFilteredDevicesVersionResponse } from "../../src/types/version";

jest.mock("axios");

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEVICE: Device = { id: "device-1", name: "Laptop", type: "CLIENT", connections: [{ mac: "AA:BB", ctype: "WIFI" }] };
const CREATE_DEVICE: CreateDeviceRequest = { name: "Laptop", type: "CLIENT", connections: DEVICE.connections };
const UPDATE_DEVICE: UpdateDeviceRequest = { id: DEVICE.id, name: "Desktop" };
const LOGIN_RESPONSE: LoginResponse = {
    user: { id: "user-1", username: "ronin", roles: ["ADMIN"] },
    accessToken: "access-token",
    refreshToken: "refresh-token",
};

describe("ApiUtils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ApiUtils.DEVICES_VERSION = "0";
        ApiUtils.WHITELIST_VERSION = "0";
    });

    it("logs in with credentials", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: LOGIN_RESPONSE });
        const request = { username: "ronin", password: "secret" };
        expect(await ApiUtils.login(request)).toEqual({ success: true, data: LOGIN_RESPONSE });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth`, request);
    });

    it("refreshes authentication tokens", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: LOGIN_RESPONSE });
        const request = { refreshToken: "refresh-token" };
        expect(await ApiUtils.refreshToken(request)).toEqual({ success: true, data: LOGIN_RESPONSE });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/refresh`, request);
    });

    it("logs out", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: undefined });
        const request = { refreshToken: "refresh-token" };
        expect(await ApiUtils.logout(request)).toEqual({ success: true, data: undefined });
        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/auth`, { data: request });
    });

    it("updates the current username", async () => {
        const request = { id: "user-1", username: "new-username" };
        const response = { username: "new-username" };
        jest.mocked(axios.put).mockResolvedValue({ data: response });
        expect(await ApiUtils.updateUsername(request)).toEqual({ success: true, data: response });
        expect(axios.put).toHaveBeenCalledWith(`${API_URL}/users`, request);
    });

    it("updates the current password", async () => {
        jest.mocked(axios.patch).mockResolvedValue({ data: undefined });
        const request = { currentPassword: "current-password", newPassword: "new-password" };
        expect(await ApiUtils.updatePassword(request)).toEqual({ success: true, data: undefined });
        expect(axios.patch).toHaveBeenCalledWith(`${API_URL}/users/password`, request);
    });

    it("returns the version for an identifier", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: { devices: "12", whitelist: "7" } });
        expect(await ApiUtils.getVersion<GetFilteredDevicesVersionResponse>("devices,whitelist")).toEqual({
            success: true,
            data: { devices: "12", whitelist: "7" }
        });
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/data-versions`, {
            params: { id: "devices,whitelist" }
        });
    });

    it("returns all devices", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE], headers: { "data-version": "12" } });
        expect(await ApiUtils.getDevices()).toEqual({ success: true, data: [DEVICE] });
        expect(ApiUtils.DEVICES_VERSION).toBe("12");
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices`);
    });

    it("returns allowed devices for a router", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE], headers: { "devices-version": "13", "whitelist-version": "7" } });
        expect(await ApiUtils.getAllowedDevices("router-1")).toEqual({ success: true, data: [DEVICE] });
        expect(ApiUtils.DEVICES_VERSION).toBe("13");
        expect(ApiUtils.WHITELIST_VERSION).toBe("7");
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices/allowed/router-1`);
    });

    it("returns not allowed devices for a router", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE], headers: { "devices-version": "14", "whitelist-version": "8" } });
        expect(await ApiUtils.getNotAllowedDevices("router-1")).toEqual({ success: true, data: [DEVICE] });
        expect(ApiUtils.DEVICES_VERSION).toBe("14");
        expect(ApiUtils.WHITELIST_VERSION).toBe("8");
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices/notallowed/router-1`);
    });

    it("creates a device", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: DEVICE });
        expect(await ApiUtils.createDevice(CREATE_DEVICE)).toEqual({ success: true, data: DEVICE });
        expect(ApiUtils.DEVICES_VERSION).toBe("1");
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/devices`, CREATE_DEVICE);
    });

    it("updates a device", async () => {
        jest.mocked(axios.put).mockResolvedValue({ data: DEVICE });
        expect(await ApiUtils.updateDevice(UPDATE_DEVICE)).toEqual({ success: true, data: DEVICE });
        expect(ApiUtils.DEVICES_VERSION).toBe("1");
        expect(axios.put).toHaveBeenCalledWith(`${API_URL}/devices`, UPDATE_DEVICE);
    });

    it("deletes a device", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: { id: DEVICE.id } });
        expect(await ApiUtils.deleteDevice(DEVICE.id)).toEqual({ success: true, data: { id: DEVICE.id } });
        expect(ApiUtils.DEVICES_VERSION).toBe("1");
        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/devices/${DEVICE.id}`);
    });

    it("creates a whitelist entry with the router id in the URL", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: { id: DEVICE.id, mac: "AA:BB" } });
        expect(await ApiUtils.createWhitelist({ routerId: "router-1", id: DEVICE.id, mac: "AA:BB" })).toEqual({
            success: true,
            data: { id: DEVICE.id, mac: "AA:BB" },
        });
        expect(ApiUtils.WHITELIST_VERSION).toBe("1");
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/whitelist/router-1`, { id: DEVICE.id, mac: "AA:BB" });
    });

    it("deletes a whitelist entry with the MAC in the request body", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: { id: DEVICE.id, mac: "AA:BB" } });
        expect(await ApiUtils.deleteWhitelist({ routerId: "router-1", id: DEVICE.id, mac: "AA:BB" })).toEqual({
            success: true,
            data: { id: DEVICE.id, mac: "AA:BB" },
        });
        expect(ApiUtils.WHITELIST_VERSION).toBe("1");
        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/whitelist/router-1`, {
            data: { id: DEVICE.id, mac: "AA:BB" }
        });
    });

    it("returns the API error when the request fails with a response", async () => {
        const error = { code: "VALIDATION_FAILED", message: "Datos inválidos" };
        jest.mocked(axios.get).mockRejectedValue({ response: { data: error } });
        jest.mocked(isAxiosError).mockReturnValueOnce(true);
        expect(await ApiUtils.getDevices()).toEqual({ success: false, error });
    });

    it("returns a network error when the request fails without a response", async () => {
        jest.mocked(axios.get).mockRejectedValue(new Error("Network error"));
        const result = await ApiUtils.getDevices();
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.code).toBe("NETWORK_ERROR");
        }
    });
});
