import { fireEvent, render } from "@testing-library/react-native";
import PasswordInput from "../../src/components/password-input";

describe("PasswordInput", () => {
    it("toggles password visibility", async () => {
        const { getByDisplayValue, getByLabelText } = await render(
            <PasswordInput iconColor="black" value="secret" />
        );

        expect(getByDisplayValue("secret").props.secureTextEntry).toBe(true);
        await fireEvent.press(getByLabelText("Mostrar contraseña"));
        expect(getByDisplayValue("secret").props.secureTextEntry).toBe(false);
        await fireEvent.press(getByLabelText("Ocultar contraseña"));
        expect(getByDisplayValue("secret").props.secureTextEntry).toBe(true);
    });
});
