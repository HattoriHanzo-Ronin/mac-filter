import { fireEvent, render } from "@testing-library/react-native";
import CustomButton from "../../src/components/custom-button";

describe("CustomButton", () => {
    it("runs its action when enabled", async () => {
        const onPress = jest.fn();
        const { getByRole } = await render(<CustomButton label="Guardar" onPress={onPress} />);

        await fireEvent.press(getByRole("button", { name: "Guardar" }));

        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("blocks its action while disabled or loading", async () => {
        const onPress = jest.fn();
        const { getByRole, rerender } = await render(<CustomButton disabled label="Guardar" onPress={onPress} />);

        await fireEvent.press(getByRole("button", { name: "Guardar" }));
        await rerender(<CustomButton label="Guardar" loading onPress={onPress} />);
        await fireEvent.press(getByRole("button"));

        expect(onPress).not.toHaveBeenCalled();
    });
});
