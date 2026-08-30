import { Device } from "../../src/types/devices";
import UiUtils from "../../src/utils/ui-utils";

const DEVICE: Device = {
    id: "device-1",
    name: "Router principal",
    type: "ROUTER",
    connections: [
        { ctype: "WAN", mac: "AA:BB:CC:DD:EE:01" },
        { ctype: "WIFI", mac: "AA:BB:CC:DD:EE:02" }
    ],
    model: "AX3000",
    ip: "192.168.1.1",
    wifi_pass: "secret",
    admin_pass: "admin",
    mac_filter: true
};

describe("UiUtils", () => {
    it("clears a field validation error through its state setter", () => {
        const setValidationErrors = jest.fn();
        UiUtils.clearValidationError<{ username: string }>(setValidationErrors, "username");

        const updateErrors = setValidationErrors.mock.calls[0][0];
        expect(updateErrors({ username: ["Invalid username"] })).toEqual({});
    });

    it("maps device properties using the centralized labels", () => {
        expect(UiUtils.mapDeviceProperties(DEVICE)).toEqual([
            { key: "name", label: "Nombre", value: "Router principal" },
            { key: "type", label: "Tipo", value: "Router" },
            { key: "model", label: "Modelo", value: "AX3000" },
            { key: "connection_type", label: "Tipo de conexión", value: ["Wan", "Wifi"] },
            { key: "mac", label: "MAC", value: ["AA:BB:CC:DD:EE:01", "AA:BB:CC:DD:EE:02"] },
            { key: "ip", label: "IP", value: "192.168.1.1" },
            { key: "wifi_pass", label: "Contraseña Wi-Fi", value: "secret" }
        ]);
    });

    it("omits unavailable optional properties", () => {
        const device: Device = { id: "device-2", name: "Cliente", type: "CLIENT", connections: [] };
        expect(UiUtils.mapDeviceProperties(device)).toEqual([
            { key: "name", label: "Nombre", value: "Cliente" },
            { key: "type", label: "Tipo", value: "Cliente" }
        ]);
    });
});
