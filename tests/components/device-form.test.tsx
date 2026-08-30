import { fireEvent, render, waitFor } from "@testing-library/react-native";
import DeviceForm from "../../src/components/device-form";
import { SafeAreaProvider } from "react-native-safe-area-context";

const INITIAL_METRICS = {
    frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 }
};

describe("DeviceForm", () => {
    it("submits normalized device values", async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        const { getByLabelText, getByRole } = await render(
            <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
                <DeviceForm onSubmit={onSubmit} />
            </SafeAreaProvider>
        );

        await fireEvent.changeText(getByLabelText("Nombre"), "  Sala TV  ");
        await fireEvent.changeText(getByLabelText("Modelo"), "OLED");
        await fireEvent.changeText(getByLabelText("IP"), "192.168.1.20");
        await fireEvent.press(getByRole("button", { name: "Guardar dispositivo" }));

        await waitFor(() =>
            expect(onSubmit).toHaveBeenCalledWith({
                name: "Sala TV",
                type: "CLIENT",
                connections: [],
                model: "OLED",
                ip: "192.168.1.20"
            })
        );
    });
});
