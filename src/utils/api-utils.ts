import { LoginRequest, LoginResponse, LogoutRequest, RefreshTokenRequest, RefreshTokenResponse } from "../types/auth";
import axios, { isAxiosError } from "axios";
import { ApiError } from "../types/api-error";
import { ApiResponse } from "../types/api-response";

/**
 * Authentication API client
 *
 * @author HattoriHanzo-Ronin
 */
export default class ApiUtils {
    /**
     * Returns the login result
     *
     * @param request Login credentials
     * @returns Login response
     */
    static async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.post<LoginResponse>(this.buildUrl("auth"), request);
            return data;
        });
    }

    /**
     * Returns refreshed authentication tokens
     *
     * @param request Refresh token
     * @returns Refresh token response
     */
    static async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.post<LoginResponse>(this.buildUrl("auth/refresh"), request);
            return data;
        });
    }

    /**
     * Closes the current session
     *
     * @param request Logout token
     */
    static async logout(request: LogoutRequest): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.post<void>(this.buildUrl("auth/logout"), request);
        });
    }

    private static buildUrl(entity: string) {
        return `${process.env.EXPO_PUBLIC_API_URL}/${entity}`;
    }

    /**
     * Returns a normalized API response
     *
     * @param callback API request
     * @returns Normalized API response
     */
    private static async executeRequest<T>(callback: () => Promise<T>): Promise<ApiResponse<T>> {
        try {
            return { success: true, data: await callback() };
        } catch (err) {
            let error: ApiError = { code: "NETWORK_ERROR", message: "No se pudo conectar con el servidor" };
            if (isAxiosError<ApiError>(err) && err.response) {
                error = err.response.data;
            }

            return { success: false, error };
        }
    }
}
