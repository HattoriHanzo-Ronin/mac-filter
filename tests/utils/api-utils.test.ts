import axios, { isAxiosError } from "axios";
import ApiUtils from "../../src/utils/api-utils";
import { LoginResponse } from "../../src/types/auth";
import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "../../src/types/devices";

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

    it("returns all devices", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE] });
        expect(await ApiUtils.getDevices()).toEqual({ success: true, data: [DEVICE] });
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices`);
    });

    it("returns allowed devices for a router", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE] });
        expect(await ApiUtils.getAllowedDevices("router-1")).toEqual({ success: true, data: [DEVICE] });
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices/allowed/router-1`);
    });

    it("returns not allowed devices for a router", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE] });
        expect(await ApiUtils.getNotAllowedDevices("router-1")).toEqual({ success: true, data: [DEVICE] });
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/devices/notallowed/router-1`);
    });

    it("creates a device", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: DEVICE });
        expect(await ApiUtils.createDevice(CREATE_DEVICE)).toEqual({ success: true, data: DEVICE });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/devices`, CREATE_DEVICE);
    });

    it("updates a device", async () => {
        jest.mocked(axios.put).mockResolvedValue({ data: DEVICE });
        expect(await ApiUtils.updateDevice(UPDATE_DEVICE)).toEqual({ success: true, data: DEVICE });
        expect(axios.put).toHaveBeenCalledWith(`${API_URL}/devices`, UPDATE_DEVICE);
    });

    it("deletes a device", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: { id: DEVICE.id } });
        expect(await ApiUtils.deleteDevice(DEVICE.id)).toEqual({ success: true, data: { id: DEVICE.id } });
        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/devices/${DEVICE.id}`);
    });

    it("creates a whitelist entry with the router id in the URL", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: { id: DEVICE.id, mac: "AA:BB" } });
        expect(await ApiUtils.createWhitelist({ routerId: "router-1", id: DEVICE.id, mac: "AA:BB" })).toEqual({
            success: true,
            data: { id: DEVICE.id, mac: "AA:BB" },
        });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/whitelist/router-1`, { id: DEVICE.id, mac: "AA:BB" });
    });

    it("deletes a whitelist entry with the MAC in the request body", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: { id: DEVICE.id, mac: "AA:BB" } });
        expect(await ApiUtils.deleteWhitelist({ routerId: "router-1", id: DEVICE.id, mac: "AA:BB" })).toEqual({
            success: true,
            data: { id: DEVICE.id, mac: "AA:BB" },
        });
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
