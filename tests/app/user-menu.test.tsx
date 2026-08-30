import { fireEvent, render, waitFor } from "@testing-library/react-native";
import UserMenu from "../../src/app/_user-menu";
import type { AuthUser } from "../../src/types/auth";

const USER: AuthUser = { id: "user-1", username: "old_name", roles: ["ADMIN"] };
const mockLogout = jest.fn();
const mockSetUser = jest.fn();
const mockUpdateUsername = jest.fn();
const mockExecuteApiRequest = jest.fn(async (request: (api: { updateUsername: typeof mockUpdateUsername }) => Promise<unknown>) =>
    request({ updateUsername: mockUpdateUsername })
);

jest.mock("../../src/components/app-context-provider", () => ({
    useAppContext: () => ({
        user: USER,
        setUser: mockSetUser,
        authUtils: { logout: mockLogout },
        executeApiRequest: mockExecuteApiRequest
    })
}));

describe("UserMenu", () => {
    beforeEach(() => {
        mockLogout.mockReset().mockResolvedValue(undefined);
        mockSetUser.mockReset();
        mockUpdateUsername.mockReset().mockResolvedValue({
            success: true,
            data: { username: "new_name" }
        });
        mockExecuteApiRequest.mockClear();
    });

    it("opens the menu and logs out", async () => {
        const { getByLabelText, getByText } = await render(<UserMenu />);

        await fireEvent.press(getByLabelText("Abrir menú de usuario"));
        await fireEvent.press(getByText("Cerrar sesión"));

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("updates the username with a trimmed value", async () => {
        const { getByLabelText, getByText } = await render(<UserMenu />);

        await fireEvent.press(getByLabelText("Abrir menú de usuario"));
        await fireEvent.press(getByText("Cambiar nombre de usuario"));
        await fireEvent.changeText(getByLabelText("Nuevo nombre de usuario"), "  new_name  ");
        await fireEvent.press(getByText("Aceptar"));

        await waitFor(() =>
            expect(mockUpdateUsername).toHaveBeenCalledWith({ id: "user-1", username: "new_name" })
        );
        const updateUser = mockSetUser.mock.calls[0][0];
        expect(updateUser(USER)).toEqual({ ...USER, username: "new_name" });
    });
});
