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
import type { SocketNotification, SocketSession } from "../types/socket-session";

/**
 * API client
 *
 * @author HattoriHanzo-Ronin
 */
export default class ApiUtils {
    private devicesVersion = "0";
    private whitelistVersion = "0";
    private apiUrl: string;
    private storage: Storage;
    private socket: WebSocket | null = null;
    private socketSession: SocketSession | null = null;
    private socketConnection: Promise<void> | null = null;
    private readonly socketChangeListeners = new Set<(notification: SocketNotification) => void>();
    private readonly socketReconnectListeners = new Set<() => void>();
    private socketSessionRequest: Promise<ApiResponse<void>> | null = null;
    private isSocketSessionSuspended = true;

    constructor(apiUrl: string, storage: Storage) {
        this.apiUrl = apiUrl.replace(/\/+$/, "");
        this.storage = storage;
    }

    /** Creates or renews the socket session */
    async refreshSocketSession(): Promise<ApiResponse<void>> {
        if (this.socketSessionRequest) {
            return this.socketSessionRequest;
        }

        this.socketSessionRequest = this.executeSocketSessionRefresh().finally(() => {
            this.socketSessionRequest = null;
        });
        return this.socketSessionRequest;
    }

    /** Suspends the socket session */
    suspendSocketSession(): void {
        this.isSocketSessionSuspended = true;
        this.closeSocket();
    }

    /** Closes the current socket session */
    async closeSocketSession(): Promise<void> {
        const session = this.socketSession;
        this.suspendSocketSession();
        this.socketSession = null;
        this.clearVersions();
        if (!session) {
            return;
        }

        await this.executeRequest(async () => {
            await axios.delete(this.buildUrl(`socket-sessions/${session.id}`));
        });
    }

    /** Clears the local socket state */
    clearSocketSession(): void {
        this.suspendSocketSession();
        this.socketSession = null;
        this.clearVersions();
    }

    /** Adds a socket change listener */
    addSocketChangeListener(listener: (notification: SocketNotification) => void): () => void {
        this.socketChangeListeners.add(listener);
        return () => this.socketChangeListeners.delete(listener);
    }

    /** Adds a socket reconnection listener */
    addSocketReconnectListener(listener: () => void): () => void {
        this.socketReconnectListeners.add(listener);
        return () => this.socketReconnectListeners.delete(listener);
    }

    private async executeSocketSessionRefresh(): Promise<ApiResponse<void>> {
        this.isSocketSessionSuspended = false;
        const session = this.socketSession
            ? await this.executeRequest(async () => (await axios.post<SocketSession>(this.buildUrl(`socket-sessions/${this.socketSession!.id}/refresh`))).data)
            : await this.executeRequest(async () => (await axios.post<SocketSession>(this.buildUrl("socket-sessions"))).data);
        if (!session.success && this.socketSession && session.error.code === "SOCKET_SESSION_NOT_FOUND") {
            this.socketSession = null;
            this.closeSocket();
            return this.executeSocketSessionRefresh();
        }

        if (!session.success) {
            return { success: false, error: session.error };
        }

        this.socketSession = session.data;
        void this.openSocket().catch(() => undefined);
        return { success: true, data: undefined };
    }

    private async openSocket(): Promise<void> {
        if (!this.socketSession) {
            throw new Error("Socket session not found");
        }

        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.socketConnection) {
            await this.socketConnection;
            return;
        }

        const accessToken = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) {
            throw new Error("Access token not found");
        }

        const socket = new WebSocket(this.buildSocketUrl(this.socketSession.id));
        let opened = false;
        this.socket = socket;
        this.socketConnection = new Promise((resolve, reject) => {
            socket.onopen = () => {
                opened = true;
                this.socketConnection = null;
                socket.send(JSON.stringify({ accessToken, entities: ["devices", "whitelist"] }));
                resolve();
            };
            socket.onmessage = ({ data }) => this.handleSocketMessage(data);
            socket.onerror = () => {
                this.socketConnection = null;
                reject();
            };
            socket.onclose = () => {
                this.socketConnection = null;
                if (!opened) {
                    if (this.socket === socket) {
                        this.socket = null;
                    }

                    reject();
                    return;
                }

                if (this.socket !== socket) {
                    return;
                }

                this.socket = null;
                if (!this.isSocketSessionSuspended && this.socketSession) {
                    this.socketReconnectListeners.forEach((listener) => listener());
                }
            };
        });
        await this.socketConnection;
    }

    private handleSocketMessage(data: string): void {
        try {
            const response = JSON.parse(data) as SocketNotification | ApiError;
            if ("code" in response) {
                this.socketSession = null;
                this.closeSocket();
                return;
            }

            if (
                (response.entity !== "devices" && response.entity !== "whitelist") ||
                typeof response.version !== "string"
            ) {
                return;
            }

            const currentVersion = response.entity === "devices" ? this.devicesVersion : this.whitelistVersion;
            if (response.version === currentVersion) {
                return;
            }

            this.socketChangeListeners.forEach((listener) => listener(response));
        } catch {
            return;
        }
    }

    private closeSocket(): void {
        const socket = this.socket;
        this.socket = null;
        this.socketConnection = null;
        socket?.close();
    }

    private buildSocketUrl(id: string): string {
        const url = new URL(this.apiUrl);
        const protocol = url.protocol === "https:" ? "wss:" : "ws:";
        return `${protocol}//${url.host}/events/${encodeURIComponent(id)}`;
    }

    private clearVersions(): void {
        this.devicesVersion = "0";
        this.whitelistVersion = "0";
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
            this.devicesVersion = String(headers["data-version"]);
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
            this.devicesVersion = String(headers["devices-version"]);
            this.whitelistVersion = String(headers["whitelist-version"]);
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
            this.devicesVersion = String(headers["devices-version"]);
            this.whitelistVersion = String(headers["whitelist-version"]);
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
            this.devicesVersion = String(BigInt(this.devicesVersion) + 1n);
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
            this.devicesVersion = String(BigInt(this.devicesVersion) + 1n);
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
            this.devicesVersion = String(BigInt(this.devicesVersion) + 1n);
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
            this.whitelistVersion = String(BigInt(this.whitelistVersion) + 1n);
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
            this.whitelistVersion = String(BigInt(this.whitelistVersion) + 1n);
            return response.data;
        });
    }

    get DEVICES_VERSION(): string {
        return this.devicesVersion;
    }

    get WHITELIST_VERSION(): string {
        return this.whitelistVersion;
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
