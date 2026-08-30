import type { ApiResponse } from "../types/api-response";
import type { AuthUser, LoginRequest, LoginResponse, RefreshTokenRequest } from "../types/auth";
import axios from "axios";
import ApiUtils from "./api-utils";
import type { Storage } from "./storage/storage";
import UiUtils from "./ui-utils";
import type { ApiValidationErrorDetail } from "../types/api-error";

/**
 * Authentication manager
 *
 * @author HattoriHanzo-Ronin
 */
export default class AuthUtils {
    private static AUTH_INTERCEPTOR_ID: number | null = null;
    private static REFRESH_TOKEN_KEY = "refreshToken";
    private static SESSION_GENERATION = 0;
    private setIsAuthenticated: (isAuthenticated: boolean) => void;
    private setUser: (user: AuthUser | null) => void;
    private storage: Storage;

    constructor(
        setIsAuthenticated: (isAuthenticated: boolean) => void,
        setUser: (user: AuthUser | null) => void,
        storage: Storage
    ) {
        this.setIsAuthenticated = setIsAuthenticated;
        this.setUser = setUser;
        this.storage = storage;
    }

    /**
     * Authenticates a user with credentials
     *
     * @param credentials Login credentials
     * @returns Validation error details or nothing
     */
    async login(credentials: LoginRequest): Promise<ApiValidationErrorDetail[] | undefined> {
        const result = await this.authenticate(() => ApiUtils.login(credentials));
        if (!result.success) {
            const { code, details } = result.error;
            if (code === "VALIDATION_FAILED" && details) {
                return details;
            }
        }

        return undefined;
    }

    /**
     * Restores the current authentication session
     *
     * @returns Whether the session was restored
     */
    async restoreSession(): Promise<boolean> {
        const refreshToken = await this.storage.get<RefreshTokenRequest>(AuthUtils.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            this.clearSession();
            return false;
        }

        const { success } = await this.authenticate(() => ApiUtils.refreshToken(refreshToken));
        return success;
    }

    /**
     * Closes the current authentication session
     */
    async logout(): Promise<void> {
        const refreshToken = await this.storage.get<RefreshTokenRequest>(AuthUtils.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            this.clearSession();
            return;
        }

        const result = await ApiUtils.logout(refreshToken);
        if (result.success) {
            await this.storage.delete(AuthUtils.REFRESH_TOKEN_KEY);
            this.clearSession();
            return;
        }

        UiUtils.showMessage(result.error.message);
    }

    /**
     * Authenticates using an API request
     *
     * @param request Authentication request
     * @returns Authentication response
     */
    private async authenticate(
        request: () => Promise<ApiResponse<LoginResponse>>
    ): Promise<ApiResponse<LoginResponse>> {
        const generation = AuthUtils.SESSION_GENERATION;
        const result = await request();
        if (generation !== AuthUtils.SESSION_GENERATION) {
            return { success: false, error: { code: "SESSION_INVALIDATED", message: "" } };
        }

        const { success } = result;
        if (success) {
            const { user, refreshToken, accessToken } = result.data;
            await this.storage.set<RefreshTokenRequest>(AuthUtils.REFRESH_TOKEN_KEY, { refreshToken });
            if (AuthUtils.AUTH_INTERCEPTOR_ID !== null) {
                axios.interceptors.request.eject(AuthUtils.AUTH_INTERCEPTOR_ID);
            }

            AuthUtils.AUTH_INTERCEPTOR_ID = axios.interceptors.request.use((config) => {
                config.headers.Authorization = `Bearer ${accessToken}`;
                return config;
            });
            this.setUser(user);
            this.setIsAuthenticated(true);
        }

        if (!success) {
            const { error } = result;
            if (error.code === "INVALID_TOKEN") {
                await this.storage.delete(AuthUtils.REFRESH_TOKEN_KEY);
                this.clearSession();
            }

            if (error.code !== "VALIDATION_FAILED") {
                UiUtils.showMessage(error.message);
            }
        }

        return result;
    }

    private clearSession(): void {
        if (AuthUtils.AUTH_INTERCEPTOR_ID !== null) {
            axios.interceptors.request.eject(AuthUtils.AUTH_INTERCEPTOR_ID);
            AuthUtils.AUTH_INTERCEPTOR_ID = null;
        }

        this.setUser(null);
        this.setIsAuthenticated(false);
        AuthUtils.SESSION_GENERATION++;
    }
}
