import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Login from "../../src/app/index";

const mockLogin = jest.fn();
const mockRestoreSession = jest.fn();
const mockRun = jest.fn((operation: () => Promise<unknown>) => operation());

jest.mock("../../src/components/app-context-provider", () => ({
    useAppContext: () => ({
        authUtils: { login: mockLogin, restoreSession: mockRestoreSession },
        loadingUtils: { run: mockRun },
        isAuthenticated: false,
        isLoading: false
    })
}));

describe("Login", () => {
    beforeEach(() => {
        mockLogin.mockReset().mockResolvedValue(undefined);
        mockRestoreSession.mockReset().mockResolvedValue(false);
        mockRun.mockClear();
    });

    it("restores the session and submits trimmed credentials", async () => {
        const { getByLabelText, getByRole } = await render(<Login />);

        await waitFor(() => expect(mockRestoreSession).toHaveBeenCalled());
        await fireEvent.changeText(getByLabelText("Usuario"), "  test_user  ");
        await fireEvent.changeText(getByLabelText("Contraseña"), "secret");
        await fireEvent.press(getByRole("button", { name: "Entrar" }));

        await waitFor(() =>
            expect(mockLogin).toHaveBeenCalledWith({ username: "test_user", password: "secret" })
        );
    });

    it("shows validation messages returned by the API", async () => {
        mockLogin.mockResolvedValue([{ field: "username", message: "Usuario incorrecto" }]);
        const { findByText, getByLabelText, getByRole } = await render(<Login />);

        await fireEvent.changeText(getByLabelText("Usuario"), "test_user");
        await fireEvent.changeText(getByLabelText("Contraseña"), "secret");
        await fireEvent.press(getByRole("button", { name: "Entrar" }));

        expect(await findByText("- Usuario incorrecto")).toBeTruthy();
    });
});
