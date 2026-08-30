import type { LoginRequest, LoginResponse, LogoutRequest, RefreshTokenRequest, RefreshTokenResponse } from "../types/auth";
import axios, { isAxiosError } from "axios";
import type { ApiError } from "../types/api-error";
import type { ApiResponse } from "../types/api-response";
import {
    CreateDeviceRequest,
    CreateDeviceResponse,
    DeleteDeviceResponse,
    GetAllowedDevicesResponse,
    GetDevicesResponse,
    GetNotAllowedDevicesResponse,
    UpdateDeviceRequest,
    UpdateDeviceResponse
} from "../types/devices";
import {
    CreateWhitelistRequest,
    CreateWhitelistResponse,
    DeleteWhitelistRequest,
    DeleteWhitelistResponse
} from "../types/whitelist";
import type { UpdatePasswordRequest, UpdateUsernameRequest, UpdateUsernameResponse } from "../types/users";

/**
 * API client
 *
 * @author HattoriHanzo-Ronin
 */
export default class ApiUtils {
    static DEVICES_VERSION = "0";
    static WHITELIST_VERSION = "0";

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
     * @returns Logout response
     */
    static async logout(request: LogoutRequest): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.delete<void>(this.buildUrl("auth"), { data: request });
        });
    }

    /**
     * Updates the current username
     *
     * @param request Username data
     * @returns Updated username
     */
    static async updateUsername(request: UpdateUsernameRequest): Promise<ApiResponse<UpdateUsernameResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.put<UpdateUsernameResponse>(this.buildUrl("users"), request);
            return data;
        });
    }

    /**
     * Updates the current password
     *
     * @param request Password data
     * @returns Update response
     */
    static async updatePassword(request: UpdatePasswordRequest): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.patch<void>(this.buildUrl("users/password"), request);
        });
    }

    /**
     * Returns the version for an identifier
     *
     * @param id Version identifier
     * @returns Version
     */
    static async getVersion<T>(id: string): Promise<ApiResponse<T>> {
        return this.executeRequest(async () => {
            const { data } = await axios.get<T>(this.buildUrl("data-versions"), { params: { id } });
            return data;
        });
    }

    /**
     * Returns all devices
     *
     * @returns Devices
     */
    static async getDevices(): Promise<ApiResponse<GetDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetDevicesResponse>(this.buildUrl("devices"));
            ApiUtils.DEVICES_VERSION = String(headers["data-version"]);
            return data;
        });
    }

    /**
     * Returns allowed devices for a router
     *
     * @param id Router identifier
     * @returns Allowed devices
     */
    static async getAllowedDevices(id: string): Promise<ApiResponse<GetAllowedDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetAllowedDevicesResponse>(this.buildUrl(`devices/allowed/${id}`));
            ApiUtils.DEVICES_VERSION = String(headers["devices-version"]);
            ApiUtils.WHITELIST_VERSION = String(headers["whitelist-version"]);
            return data;
        });
    }

    /**
     * Returns not allowed devices for a router
     *
     * @param id Router identifier
     * @returns Not allowed devices
     */
    static async getNotAllowedDevices(id: string): Promise<ApiResponse<GetNotAllowedDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetNotAllowedDevicesResponse>(this.buildUrl(`devices/notallowed/${id}`));
            ApiUtils.DEVICES_VERSION = String(headers["devices-version"]);
            ApiUtils.WHITELIST_VERSION = String(headers["whitelist-version"]);
            return data;
        });
    }

    /**
     * Creates a device
     *
     * @param request Device data
     * @returns Created device
     */
    static async createDevice(request: CreateDeviceRequest): Promise<ApiResponse<CreateDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.post<CreateDeviceResponse>(this.buildUrl("devices"), request);
            ApiUtils.DEVICES_VERSION = String(BigInt(ApiUtils.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Updates a device
     *
     * @param request Device data
     * @returns Updated device
     */
    static async updateDevice(request: UpdateDeviceRequest): Promise<ApiResponse<UpdateDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.put<UpdateDeviceResponse>(this.buildUrl("devices"), request);
            ApiUtils.DEVICES_VERSION = String(BigInt(ApiUtils.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Deletes a device
     *
     * @param id Device identifier
     * @returns Deleted device identifier
     */
    static async deleteDevice(id: string): Promise<ApiResponse<DeleteDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.delete<DeleteDeviceResponse>(this.buildUrl(`devices/${id}`));
            ApiUtils.DEVICES_VERSION = String(BigInt(ApiUtils.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Creates a whitelist entry
     *
     * @param request Whitelist data
     * @returns Created whitelist entry
     */
    static async createWhitelist(request: CreateWhitelistRequest): Promise<ApiResponse<CreateWhitelistResponse>> {
        return this.executeRequest(async () => {
            const { routerId, ...data } = request;
            const response = await axios.post<CreateWhitelistResponse>(this.buildUrl(`whitelist/${routerId}`), data);
            ApiUtils.WHITELIST_VERSION = String(BigInt(ApiUtils.WHITELIST_VERSION) + 1n);
            return response.data;
        });
    }

    /**
     * Deletes a whitelist entry
     *
     * @param request Whitelist data
     * @returns Deleted whitelist entry
     */
    static async deleteWhitelist(request: DeleteWhitelistRequest): Promise<ApiResponse<DeleteWhitelistResponse>> {
        return this.executeRequest(async () => {
            const { routerId, ...data } = request;
            const response = await axios.delete<DeleteWhitelistResponse>(this.buildUrl(`whitelist/${routerId}`), {
                data
            });
            ApiUtils.WHITELIST_VERSION = String(BigInt(ApiUtils.WHITELIST_VERSION) + 1n);
            return response.data;
        });
    }

    private static buildUrl(entity: string): string {
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
