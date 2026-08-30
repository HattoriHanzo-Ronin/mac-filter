import { fireEvent, render } from "@testing-library/react-native";
import DeviceSearchInput from "../../src/components/device-search-input";
import type { Device } from "../../src/types/devices";
import UiUtils from "../../src/utils/ui-utils";

jest.mock("../../src/components/app-context-provider", () => ({
    useAppContext: () => ({ isLoading: false })
}));

const DEVICE: Device = {
    id: "1",
    name: "Consola",
    type: "CLIENT",
    connections: [{ ctype: "WIFI", mac: "AA:BB:CC:DD:EE:01" }]
};

describe("DeviceSearchInput", () => {
    afterEach(() => jest.restoreAllMocks());

    it.each(["consola", "aa:bb:cc:dd:ee:01"])("selects a device matching %s", async (query) => {
        const onSelect = jest.fn();
        const { getByLabelText, getByRole } = await render(
            <DeviceSearchInput devices={[DEVICE]} onSelect={onSelect} />
        );

        await fireEvent.changeText(getByLabelText("Buscar por nombre o MAC"), query);
        await fireEvent.press(getByRole("button", { name: "Buscar" }));

        expect(onSelect).toHaveBeenCalledWith(DEVICE);
        expect(getByLabelText("Buscar por nombre o MAC").props.value).toBe("");
    });

    it("shows feedback when no device matches", async () => {
        const showMessage = jest.spyOn(UiUtils, "showMessage").mockImplementation();
        const { getByLabelText, getByRole } = await render(
            <DeviceSearchInput devices={[DEVICE]} onSelect={jest.fn()} />
        );

        await fireEvent.changeText(getByLabelText("Buscar por nombre o MAC"), "Desconocido");
        await fireEvent.press(getByRole("button", { name: "Buscar" }));

        expect(showMessage).toHaveBeenCalledWith("No se ha encontrado resultado");
    });
});
