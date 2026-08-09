import axios, { InternalAxiosRequestConfig } from "axios";
import { ApiValidationErrorDetail } from "../../src/types/api-error";
import { AuthUser, LoginRequest, LoginResponse, RefreshTokenRequest } from "../../src/types/auth";
import ApiUtils from "../../src/utils/api-utils";
import AuthUtils from "../../src/utils/auth-utils";
import SecureStoreUtils from "../../src/utils/storage/secure-store-utils";
import UiUtils from "../../src/utils/ui-utils";

const CREDENTIALS: LoginRequest = { username: "ronin", password: "secret" };
const USER: AuthUser = { id: "1", username: "ronin", roles: ["ADMIN"] };
const LOGIN_RESPONSE: LoginResponse = {
    user: USER,
    accessToken: "access-token",
    refreshToken: "refresh-token"
};
const STORED_REFRESH_TOKEN: RefreshTokenRequest = { refreshToken: "stored-refresh-token" };
const VALIDATION_DETAILS: ApiValidationErrorDetail[] = [{ field: "username", message: "El usuario es obligatorio" }];

describe("AuthUtils", () => {
    const setIsAuthenticated = jest.fn();
    const setUser = jest.fn();
    let authUtils: AuthUtils;
    let secureStoreUtils: SecureStoreUtils;

    beforeEach(() => {
        jest.clearAllMocks();
        secureStoreUtils = new SecureStoreUtils();
        authUtils = new AuthUtils(setIsAuthenticated, setUser, secureStoreUtils);
        jest.spyOn(axios.interceptors.request, "use").mockReturnValue(1);
        jest.spyOn(secureStoreUtils, "set").mockResolvedValue();
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(null);
        jest.spyOn(secureStoreUtils, "delete").mockResolvedValue();
        jest.spyOn(UiUtils, "showMessage").mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("stores the refresh token and authenticates the user after a successful login", async () => {
        jest.spyOn(ApiUtils, "login").mockResolvedValue({ success: true, data: LOGIN_RESPONSE });
        await authUtils.login(CREDENTIALS);
        expect(secureStoreUtils.set).toHaveBeenCalledWith("refreshToken", { refreshToken: "refresh-token" });
        expect(setUser).toHaveBeenCalledWith(USER);
        expect(setIsAuthenticated).toHaveBeenCalledWith(true);
    });

    it("keeps the session and displays the error after an incorrect login", async () => {
        jest.spyOn(ApiUtils, "login").mockResolvedValue({
            success: false,
            error: { code: "INVALID_CREDENTIALS", message: "Credenciales incorrectas" }
        });
        await authUtils.login(CREDENTIALS);
        expect(setUser).not.toHaveBeenCalled();
        expect(setIsAuthenticated).not.toHaveBeenCalled();
        expect(UiUtils.showMessage).toHaveBeenCalledWith("Credenciales incorrectas");
    });

    it("returns validation details without displaying a message", async () => {
        jest.spyOn(ApiUtils, "login").mockResolvedValue({
            success: false,
            error: { code: "VALIDATION_FAILED", message: "Validación fallida", details: VALIDATION_DETAILS }
        });
        expect(await authUtils.login(CREDENTIALS)).toEqual(VALIDATION_DETAILS);
        expect(UiUtils.showMessage).not.toHaveBeenCalled();
    });

    it("replaces the refresh token and updates the user after a successful refresh", async () => {
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(STORED_REFRESH_TOKEN);
        jest.spyOn(ApiUtils, "refreshToken").mockResolvedValue({ success: true, data: LOGIN_RESPONSE });
        await expect(authUtils.restoreSession()).resolves.toBe(true);
        expect(ApiUtils.refreshToken).toHaveBeenCalledWith(STORED_REFRESH_TOKEN);
        expect(secureStoreUtils.set).toHaveBeenCalledWith("refreshToken", { refreshToken: "refresh-token" });
        expect(setUser).toHaveBeenCalledWith(USER);
        expect(setIsAuthenticated).toHaveBeenCalledWith(true);
    });

    it("clears the session when there is no refresh token", async () => {
        const refreshSpy = jest.spyOn(ApiUtils, "refreshToken");
        await expect(authUtils.restoreSession()).resolves.toBe(false);
        expect(refreshSpy).not.toHaveBeenCalled();
        expect(setUser).toHaveBeenCalledWith(null);
        expect(setIsAuthenticated).toHaveBeenCalledWith(false);
    });

    it("deletes the refresh token and clears the session when it is invalid", async () => {
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(STORED_REFRESH_TOKEN);
        jest.spyOn(ApiUtils, "refreshToken").mockResolvedValue({
            success: false,
            error: { code: "INVALID_TOKEN", message: "Token inválido" }
        });
        await expect(authUtils.restoreSession()).resolves.toBe(false);
        expect(secureStoreUtils.delete).toHaveBeenCalledWith("refreshToken");
        expect(setUser).toHaveBeenCalledWith(null);
        expect(setIsAuthenticated).toHaveBeenCalledWith(false);
    });

    it("keeps the refresh token after a network error", async () => {
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(STORED_REFRESH_TOKEN);
        jest.spyOn(ApiUtils, "refreshToken").mockResolvedValue({
            success: false,
            error: { code: "NETWORK_ERROR", message: "Error de red" }
        });
        await expect(authUtils.restoreSession()).resolves.toBe(false);
        expect(secureStoreUtils.delete).not.toHaveBeenCalled();
        expect(setUser).not.toHaveBeenCalled();
        expect(setIsAuthenticated).not.toHaveBeenCalled();
    });

    it("deletes the refresh token and clears the session after logout", async () => {
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(STORED_REFRESH_TOKEN);
        jest.spyOn(ApiUtils, "logout").mockResolvedValue({ success: true, data: undefined });
        await authUtils.logout();
        expect(secureStoreUtils.delete).toHaveBeenCalledWith("refreshToken");
        expect(setUser).toHaveBeenCalledWith(null);
        expect(setIsAuthenticated).toHaveBeenCalledWith(false);
    });

    it("keeps the session and displays the error after a failed logout", async () => {
        jest.spyOn(secureStoreUtils, "get").mockResolvedValue(STORED_REFRESH_TOKEN);
        jest.spyOn(ApiUtils, "logout").mockResolvedValue({
            success: false,
            error: { code: "NETWORK_ERROR", message: "Error de red" }
        });
        await authUtils.logout();
        expect(secureStoreUtils.delete).not.toHaveBeenCalled();
        expect(setUser).not.toHaveBeenCalled();
        expect(setIsAuthenticated).not.toHaveBeenCalled();
        expect(UiUtils.showMessage).toHaveBeenCalledWith("Error de red");
    });

    it("adds the access token to subsequent requests", async () => {
        jest.spyOn(ApiUtils, "login").mockResolvedValue({ success: true, data: LOGIN_RESPONSE });
        await authUtils.login(CREDENTIALS);
        const interceptor = jest.mocked(axios.interceptors.request.use).mock.calls[0][0];
        const config = await interceptor!({ headers: {} } as InternalAxiosRequestConfig);
        expect(config.headers.Authorization).toBe("Bearer access-token");
    });
});
