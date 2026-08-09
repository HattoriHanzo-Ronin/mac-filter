import { ApiResponse } from "../types/api-response";
import { AuthUser, LoginRequest, LoginResponse, RefreshTokenRequest } from "../types/auth";
import axios from "axios";
import ApiUtils from "./api-utils";
import { Storage } from "./storage/storage";
import UiUtils from "./ui-utils";
import { ApiValidationErrorDetail } from "../types/api-error";

/**
 * Authentication manager
 *
 * @author HattoriHanzo-Ronin
 */
export default class AuthUtils {
    private static AUTH_INTERCEPTOR_ID: number | null = null;
    private static REFRESH_TOKEN_KEY = "refreshToken";
    private setIsAuthenticated: (isAuthenticated: boolean) => void;
    private setUser: (user: AuthUser | null) => void;
    private setIsLoading: (isLoading: boolean) => void;
    private storage: Storage;

    constructor(
        setIsAuthenticated: (isAuthenticated: boolean) => void,
        setUser: (user: AuthUser | null) => void,
        setIsLoading: (isLoading: boolean) => void,
        storage: Storage
    ) {
        this.setIsAuthenticated = setIsAuthenticated;
        this.setUser = setUser;
        this.setIsLoading = setIsLoading;
        this.storage = storage;
    }

    /**
     * Authenticates a user with credentials
     *
     * @param credentials Login credentials
     * @returns Validation error details or nothing
     */
    async login(credentials: LoginRequest): Promise<ApiValidationErrorDetail[] | undefined> {
        return this.authenticate(() => ApiUtils.login(credentials));
    }

    /**
     * Restores the current authentication session
     */
    async restoreSession(): Promise<void> {
        const refreshToken = await this.storage.get<RefreshTokenRequest>(AuthUtils.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            this.clearSession();
            return;
        }

        await this.authenticate(() => ApiUtils.refreshToken(refreshToken));
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

        this.setIsLoading(true);
        const result = await ApiUtils.logout(refreshToken);
        if (result.success) {
            await this.storage.delete(AuthUtils.REFRESH_TOKEN_KEY);
            this.clearSession();
            this.setIsLoading(false);
            return;
        }

        UiUtils.showMessage(result.error.message);
        this.setIsLoading(false);
    }

    /**
     * Authenticates using an API request
     *
     * @param request Authentication request
     * @returns Validation error details or nothing
     */
    private async authenticate(
        request: () => Promise<ApiResponse<LoginResponse>>
    ): Promise<ApiValidationErrorDetail[] | undefined> {
        this.setIsLoading(true);
        const result = await request();
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
            this.setIsLoading(false);
            return undefined;
        }

        const { code, message, details } = result.error;
        switch (code) {
            case "INVALID_TOKEN": {
                await this.storage.delete(AuthUtils.REFRESH_TOKEN_KEY);
                this.clearSession();
                break;
            }
            case "VALIDATION_FAILED": {
                this.setIsLoading(false);
                return details;
            }
        }

        UiUtils.showMessage(message);
        this.setIsLoading(false);
        return undefined;
    }

    private clearSession(): void {
        if (AuthUtils.AUTH_INTERCEPTOR_ID !== null) {
            axios.interceptors.request.eject(AuthUtils.AUTH_INTERCEPTOR_ID);
            AuthUtils.AUTH_INTERCEPTOR_ID = null;
        }

        this.setUser(null);
        this.setIsAuthenticated(false);
    }
}
