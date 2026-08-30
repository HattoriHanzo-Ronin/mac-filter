import type { Dispatch, SetStateAction } from "react";
import type ApiUtils from "../utils/api-utils";
import type AuthUtils from "../utils/auth-utils";
import type LoadingUtils from "../utils/loading-utils";
import type { ApiResponse } from "./api-response";
import type { AuthUser } from "./auth";
import type { Device } from "./devices";

export type ExecuteApiRequest = <T>(
    request: (apiUtils: typeof ApiUtils) => Promise<ApiResponse<T>>,
    isBackground?: boolean
) => Promise<ApiResponse<T>>;

/** Shared application state and operations */
export interface AppContextValue {
    isAuthenticated: boolean;
    user: AuthUser | null;
    setUser: Dispatch<SetStateAction<AuthUser | null>>;
    isLoading: boolean;
    loadingStartedAt: number | null;
    authUtils: AuthUtils;
    loadingUtils: LoadingUtils;
    executeApiRequest: ExecuteApiRequest;
    lastDevice: Device | null;
    setLastDevice: Dispatch<SetStateAction<Device | null>>;
    devices: Device[];
    setDevices: Dispatch<SetStateAction<Device[]>>;
}
