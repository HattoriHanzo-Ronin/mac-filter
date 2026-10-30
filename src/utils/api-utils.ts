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
import type { RouterCpanelNavigationAction, RouterCpanelSession, RouterCpanelTheme } from "../types/router-cpanel";
import type { Storage } from "./storage/storage";
import { STORAGE_KEYS } from "../constants/storage";
import type { SocketSession, SocketVersions, VersionEntity } from "../types/socket-session";

/**
 * API client
 *
 * @author HattoriHanzo-Ronin
 */
export default class ApiUtils {
    DEVICES_VERSION = "0";
    WHITELIST_VERSION = "0";
    private apiUrl: string;
    private storage: Storage;
    private socket: WebSocket | null = null;
    private socketSession: SocketSession | null = null;
    private socketConnection: Promise<void> | null = null;
    private socketRequest: Promise<ApiResponse<SocketVersions>> | null = null;
    private resolveSocketRequest: ((response: ApiResponse<SocketVersions>) => void) | null = null;
    private isSocketSuspended = true;
    private isSocketTokenInvalid = false;
    private resumeSocketRequest: Promise<void> | null = null;

    constructor(apiUrl: string, storage: Storage) {
        this.apiUrl = apiUrl.replace(/\/+$/, "");
        this.storage = storage;
    }

    async refreshSocketSession(): Promise<void> {
        this.isSocketSuspended = false;
        this.isSocketTokenInvalid = false;
        const accessToken = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) {
            return;
        }

        const session = this.socketSession
            ? await this.executeRequest(async () => (await axios.post<SocketSession>(this.buildUrl(`socket-sessions/${this.socketSession!.id}/refresh`))).data)
            : await this.executeRequest(async () => (await axios.post<SocketSession>(this.buildUrl("socket-sessions"))).data);
        if (!session.success && this.socketSession) {
            this.socketSession = null;
            this.closeSocket();
            await this.refreshSocketSession();
            return;
        }

        if (!session.success) {
            return;
        }

        this.socketSession = session.data;
        void this.openSocket().catch(() => undefined);
    }

    async resumeSocketSession(): Promise<void> {
        if (this.resumeSocketRequest) {
            await this.resumeSocketRequest;
            return;
        }

        if (!this.isSocketSuspended) {
            return;
        }

        this.isSocketSuspended = false;
        this.resumeSocketRequest = this.refreshSocketSession().finally(() => {
            this.resumeSocketRequest = null;
        });
        await this.resumeSocketRequest;
    }

    suspendSocketSession(): void {
        this.isSocketSuspended = true;
        this.closeSocket();
    }

    async closeSocketSession(): Promise<void> {
        const session = this.socketSession;
        this.suspendSocketSession();
        this.socketSession = null;
        if (session) {
            await this.executeRequest(async () => {
                await axios.delete(this.buildUrl(`socket-sessions/${session.id}`));
            });
        }
    }

    async getSocketVersions<T extends SocketVersions>(entities: VersionEntity[]): Promise<ApiResponse<T>> {
        if (this.isSocketSuspended) {
            return { success: true, data: {} as T };
        }

        if (this.socketRequest) {
            return this.socketRequest as Promise<ApiResponse<T>>;
        }

        this.socketRequest = this.requestSocketVersions(entities).finally(() => {
            this.socketRequest = null;
        });
        return this.socketRequest as Promise<ApiResponse<T>>;
    }

    private async requestSocketVersions(entities: VersionEntity[]): Promise<ApiResponse<SocketVersions>> {
        const accessToken = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken || !this.socketSession) {
            return { success: false, error: { code: "SOCKET_SESSION_NOT_FOUND", message: "Sesión de versiones no disponible" } };
        }

        try {
            await this.openSocket();
        } catch {
            return { success: false, error: { code: "SOCKET_CONNECTION_FAILED", message: "No se pudo conectar al socket" } };
        }

        const socket = this.socket;
        if (!socket) {
            return { success: false, error: { code: "SOCKET_CONNECTION_FAILED", message: "No se pudo conectar al socket" } };
        }

        return new Promise((resolve) => {
            this.resolveSocketRequest = resolve;
            socket.onmessage = ({ data }) => {
                try {
                    const response = JSON.parse(data) as SocketVersions | ApiError;
                    if ("code" in response) {
                        if (response.code === "INVALID_TOKEN") {
                            this.isSocketTokenInvalid = true;
                        }

                        this.completeSocketRequest({ success: false, error: response });
                        return;
                    }

                    this.completeSocketRequest({ success: true, data: response });
                } catch {
                    this.completeSocketRequest({
                        success: false,
                        error: { code: "SOCKET_RESPONSE_INVALID", message: "El socket devolvió una respuesta no válida" }
                    });
                }
            };
            socket.send(JSON.stringify({ accessToken, entities }));
        });
    }

    private completeSocketRequest(response: ApiResponse<SocketVersions>): void {
        const resolve = this.resolveSocketRequest;
        this.resolveSocketRequest = null;
        resolve?.(response);
    }

    private openSocket(): Promise<void> {
        if (!this.socketSession) {
            return Promise.reject();
        }

        if (this.socket?.readyState === WebSocket.OPEN) {
            return Promise.resolve();
        }

        if (this.socketConnection) {
            return this.socketConnection;
        }

        const socket = new WebSocket(this.buildSocketUrl(this.socketSession.id));
        let opened = false;
        this.socket = socket;
        this.socketConnection = new Promise((resolve, reject) => {
            socket.onopen = () => {
                opened = true;
                this.socketConnection = null;
                resolve();
            };
            socket.onerror = () => {
                this.socketConnection = null;
                reject();
            };
            socket.onclose = () => {
                this.socketConnection = null;
                if (!opened) {
                    reject();
                }

                if (this.socket !== socket) {
                    return;
                }

                this.socket = null;
                this.completeSocketRequest({
                    success: false,
                    error: { code: "SOCKET_CONNECTION_FAILED", message: "No se pudo conectar al socket" }
                });
                if (!this.isSocketSuspended && !this.isSocketTokenInvalid && this.socketSession) {
                    void this.refreshSocketSession();
                }
            };
        });
        return this.socketConnection;
    }

    private closeSocket(): void {
        const socket = this.socket;
        this.socket = null;
        this.socketConnection = null;
        this.completeSocketRequest({
            success: false,
            error: { code: "SOCKET_CONNECTION_FAILED", message: "No se pudo conectar al socket" }
        });
        socket?.close();
    }

    private buildSocketUrl(id: string): string {
        const url = new URL(this.apiUrl);
        const protocol = url.protocol === "https:" ? "wss:" : "ws:";
        return `${protocol}//${url.host}/events/${encodeURIComponent(id)}`;
    }

    /**
     * Returns the login result
     *
     * @param request Login credentials
     * @returns Login response
     */
    async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
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
    async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
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
    async logout(request: LogoutRequest): Promise<ApiResponse<void>> {
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
    async updateUsername(request: UpdateUsernameRequest): Promise<ApiResponse<UpdateUsernameResponse>> {
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
    async updatePassword(request: UpdatePasswordRequest): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.patch<void>(this.buildUrl("users/password"), request);
        });
    }

    /**
     * Returns all devices
     *
     * @returns Devices
     */
    async getDevices(): Promise<ApiResponse<GetDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetDevicesResponse>(this.buildUrl("devices"));
            this.DEVICES_VERSION = String(headers["data-version"]);
            return data;
        });
    }

    /**
     * Returns allowed devices for a router
     *
     * @param id Router identifier
     * @returns Allowed devices
     */
    async getAllowedDevices(id: string): Promise<ApiResponse<GetAllowedDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetAllowedDevicesResponse>(this.buildUrl(`devices/allowed/${id}`));
            this.DEVICES_VERSION = String(headers["devices-version"]);
            this.WHITELIST_VERSION = String(headers["whitelist-version"]);
            return data;
        });
    }

    /**
     * Returns not allowed devices for a router
     *
     * @param id Router identifier
     * @returns Not allowed devices
     */
    async getNotAllowedDevices(id: string): Promise<ApiResponse<GetNotAllowedDevicesResponse>> {
        return this.executeRequest(async () => {
            const { data, headers } = await axios.get<GetNotAllowedDevicesResponse>(this.buildUrl(`devices/notallowed/${id}`));
            this.DEVICES_VERSION = String(headers["devices-version"]);
            this.WHITELIST_VERSION = String(headers["whitelist-version"]);
            return data;
        });
    }

    /**
     * Creates a device
     *
     * @param request Device data
     * @returns Created device
     */
    async createDevice(request: CreateDeviceRequest): Promise<ApiResponse<CreateDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.post<CreateDeviceResponse>(this.buildUrl("devices"), request);
            this.DEVICES_VERSION = String(BigInt(this.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Updates a device
     *
     * @param request Device data
     * @returns Updated device
     */
    async updateDevice(request: UpdateDeviceRequest): Promise<ApiResponse<UpdateDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.put<UpdateDeviceResponse>(this.buildUrl("devices"), request);
            this.DEVICES_VERSION = String(BigInt(this.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Deletes a device
     *
     * @param id Device identifier
     * @returns Deleted device identifier
     */
    async deleteDevice(id: string): Promise<ApiResponse<DeleteDeviceResponse>> {
        return this.executeRequest(async () => {
            const { data } = await axios.delete<DeleteDeviceResponse>(this.buildUrl(`devices/${id}`));
            this.DEVICES_VERSION = String(BigInt(this.DEVICES_VERSION) + 1n);
            return data;
        });
    }

    /**
     * Creates a router control panel session
     *
     * @param routerId Router identifier
     * @param theme Application theme
     * @returns Router control panel session
     */
    async createRouterCpanelSession(routerId: string, theme: RouterCpanelTheme): Promise<ApiResponse<RouterCpanelSession>> {
        return this.executeRequest(async () => {
            const { data } = await axios.post<RouterCpanelSession>(this.buildUrl(`devices/${routerId}/cpanel`), {
                clientType: "mobile",
                language: "es-ES",
                theme
            });
            return data;
        });
    }

    /**
     * Navigates within a router control panel session
     *
     * @param sessionId Router control panel session identifier
     * @param action Navigation action
     */
    async navigateRouterCpanelSession(
        sessionId: string,
        action: RouterCpanelNavigationAction
    ): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.post<void>(this.buildUrl(`devices/cpanel/${sessionId}/navigation`), { action });
        });
    }

    /**
     * Closes a router control panel session
     *
     * @param sessionId Router control panel session identifier
     */
    async closeRouterCpanelSession(sessionId: string): Promise<ApiResponse<void>> {
        return this.executeRequest(async () => {
            await axios.delete<void>(this.buildUrl(`devices/cpanel/${sessionId}`));
        });
    }

    /**
     * Creates a whitelist entry
     *
     * @param request Whitelist data
     * @returns Created whitelist entry
     */
    async createWhitelist(request: CreateWhitelistRequest): Promise<ApiResponse<CreateWhitelistResponse>> {
        return this.executeRequest(async () => {
            const { routerId, ...data } = request;
            const response = await axios.post<CreateWhitelistResponse>(this.buildUrl(`whitelist/${routerId}`), data);
            this.WHITELIST_VERSION = String(BigInt(this.WHITELIST_VERSION) + 1n);
            return response.data;
        });
    }

    /**
     * Deletes a whitelist entry
     *
     * @param request Whitelist data
     * @returns Deleted whitelist entry
     */
    async deleteWhitelist(request: DeleteWhitelistRequest): Promise<ApiResponse<DeleteWhitelistResponse>> {
        return this.executeRequest(async () => {
            const { routerId, ...data } = request;
            const response = await axios.delete<DeleteWhitelistResponse>(this.buildUrl(`whitelist/${routerId}`), {
                data
            });
            this.WHITELIST_VERSION = String(BigInt(this.WHITELIST_VERSION) + 1n);
            return response.data;
        });
    }

    private buildUrl(entity: string): string {
        return `${this.apiUrl}/${entity}`;
    }

    /**
     * Returns a normalized API response
     *
     * @param callback API request
     * @returns Normalized API response
     */
    private async executeRequest<T>(callback: () => Promise<T>): Promise<ApiResponse<T>> {
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
