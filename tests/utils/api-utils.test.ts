import axios, { isAxiosError } from "axios";
import ApiUtilsClass from "../../src/utils/api-utils";
import type { Storage } from "../../src/utils/storage/storage";
import { LoginResponse } from "../../src/types/auth";
import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "../../src/types/devices";

jest.mock("axios");

class MockWebSocket {
    static readonly OPEN = 1;
    static instances: MockWebSocket[] = [];
    readonly send = jest.fn();
    readonly close = jest.fn();
    onopen: (() => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;
    onerror: (() => void) | null = null;
    onclose: (() => void) | null = null;
    readyState = 0;

    constructor(readonly url: string) {
        MockWebSocket.instances.push(this);
    }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.test";
const STORAGE: Storage = { get: jest.fn(), set: jest.fn(), delete: jest.fn() };
let ApiUtils: ApiUtilsClass;
const DEVICE: Device = { id: "device-1", name: "Laptop", type: "CLIENT", connections: [{ mac: "AA:BB", ctype: "WIFI" }] };
const CREATE_DEVICE: CreateDeviceRequest = { name: "Laptop", type: "CLIENT", connections: DEVICE.connections };
const UPDATE_DEVICE: UpdateDeviceRequest = { id: DEVICE.id, name: "Desktop" };
const LOGIN_RESPONSE: LoginResponse = {
    user: { id: "user-1", username: "ronin", roles: ["ADMIN"] },
    accessToken: "access-token",
    refreshToken: "refresh-token",
};

describe("ApiUtils", () => {
    const OriginalWebSocket = global.WebSocket;

    beforeAll(() => {
        global.WebSocket = MockWebSocket as unknown as typeof WebSocket;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        MockWebSocket.instances = [];
        ApiUtils = new ApiUtilsClass(API_URL, STORAGE);
    });

    afterAll(() => {
        global.WebSocket = OriginalWebSocket;
    });

    it("subscribes once and forwards socket notifications", async () => {
        jest.mocked(STORAGE.get).mockResolvedValue("access-token");
        jest.mocked(axios.post).mockResolvedValue({ data: { id: "socket-1", expiresAt: "2026-10-29T20:00:00.000Z" } });
        const listener = jest.fn();
        ApiUtils.addSocketChangeListener(listener);

        expect(await ApiUtils.refreshSocketSession()).toEqual({ success: true, data: undefined });
        await Promise.resolve();
        const socket = MockWebSocket.instances[0];
        socket?.onopen?.();
        socket?.onmessage?.({ data: JSON.stringify({ entity: "devices", version: "1" }) });

        expect(socket?.url).toBe("wss://api.test/events/socket-1");
        expect(socket?.send).toHaveBeenCalledWith(JSON.stringify({ accessToken: "access-token", entities: ["devices", "whitelist"] }));
        expect(socket?.send).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ entity: "devices", version: "1" });
    });

    it("ignores notifications produced by the current client", async () => {
        jest.mocked(STORAGE.get).mockResolvedValue("access-token");
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE], headers: { "data-version": "12" } });
        jest.mocked(axios.post).mockResolvedValue({ data: { id: "socket-1", expiresAt: "2026-10-29T20:00:00.000Z" } });
        const listener = jest.fn();
        ApiUtils.addSocketChangeListener(listener);
        await ApiUtils.getDevices();
        await ApiUtils.refreshSocketSession();
        await Promise.resolve();
        const socket = MockWebSocket.instances[0];
        socket?.onopen?.();

        socket?.onmessage?.({ data: JSON.stringify({ entity: "devices", version: "12" }) });
        expect(listener).not.toHaveBeenCalled();
        socket?.onmessage?.({ data: JSON.stringify({ entity: "devices", version: "13" }) });
        expect(listener).toHaveBeenCalledWith({ entity: "devices", version: "13" });
    });

    it("reuses an in-flight socket session request", async () => {
        jest.mocked(STORAGE.get).mockResolvedValue("access-token");
        jest.mocked(axios.post).mockResolvedValue({ data: { id: "socket-1", expiresAt: "2026-10-29T20:00:00.000Z" } });

        await Promise.all([ApiUtils.refreshSocketSession(), ApiUtils.refreshSocketSession()]);
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("clears entity versions with the local socket session", async () => {
        jest.mocked(axios.get).mockResolvedValue({ data: [DEVICE], headers: { "data-version": "12" } });
        await ApiUtils.getDevices();
        ApiUtils.clearSocketSession();
        expect(ApiUtils.DEVICES_VERSION).toBe("0");
        expect(ApiUtils.WHITELIST_VERSION).toBe("0");
    });

    it("clears the socket session when the server returns an error", async () => {
        jest.mocked(STORAGE.get).mockResolvedValue("access-token");
        jest.mocked(axios.post).mockResolvedValue({ data: { id: "socket-1", expiresAt: "2026-10-29T20:00:00.000Z" } });
        await ApiUtils.refreshSocketSession();
        await Promise.resolve();
        const socket = MockWebSocket.instances[0];
        socket?.onopen?.();
        socket?.onmessage?.({ data: JSON.stringify({ code: "INVALID_TOKEN", message: "Token inválido" }) });

        expect(socket?.close).toHaveBeenCalled();
        jest.mocked(axios.post).mockClear();
        await ApiUtils.refreshSocketSession();
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/socket-sessions`);
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

    it("creates a mobile router control panel session", async () => {
        const session = { id: "session-1", url: "https://cpanel.example/viewer", expiresAt: "2026-10-26T17:30:00.000Z" };
        jest.mocked(axios.post).mockResolvedValue({ data: session });
        expect(await ApiUtils.createRouterCpanelSession("router-1", "dark")).toEqual({ success: true, data: session });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/devices/router-1/cpanel`, {
            clientType: "mobile",
            language: "es-ES",
            theme: "dark"
        });
    });

    it("navigates within a router control panel session", async () => {
        jest.mocked(axios.post).mockResolvedValue({ data: undefined });
        expect(await ApiUtils.navigateRouterCpanelSession("session-1", "back")).toEqual({ success: true, data: undefined });
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}/devices/cpanel/session-1/navigation`, { action: "back" });
    });

    it("closes a router control panel session", async () => {
        jest.mocked(axios.delete).mockResolvedValue({ data: undefined });
        expect(await ApiUtils.closeRouterCpanelSession("session-1")).toEqual({ success: true, data: undefined });
        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/devices/cpanel/session-1`);
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
