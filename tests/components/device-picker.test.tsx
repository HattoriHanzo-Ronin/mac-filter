import { fireEvent, render } from "@testing-library/react-native";
import DevicePicker from "../../src/components/device-picker";
import type { Device } from "../../src/types/devices";

const DEVICES: Device[] = [
    { id: "1", name: "Router", model: "AX53", type: "ROUTER", connections: [] },
    { id: "2", name: "Consola", model: "Switch", type: "CLIENT", connections: [] }
];

describe("DevicePicker", () => {
    it("opens the options and selects a device", async () => {
        const onSelect = jest.fn();
        const { getByRole, getByText, queryByText } = await render(
            <DevicePicker devices={DEVICES} onSelect={onSelect} selectedDeviceId="1" />
        );

        expect(queryByText("Consola ( Switch )")).toBeNull();
        await fireEvent.press(getByRole("button"));
        await fireEvent.press(getByText("Consola ( Switch )"));

        expect(onSelect).toHaveBeenCalledWith(DEVICES[1]);
        expect(queryByText("Consola ( Switch )")).toBeNull();
    });
});
