import { Dispatch, SetStateAction } from "react";
import ApiUtils from "../utils/api-utils";
import AuthUtils from "../utils/auth-utils";
import LoadingUtils from "../utils/loading-utils";
import { ApiResponse } from "./api-response";
import { AuthUser } from "./auth";
import { Device } from "./devices";

export type ExecuteApiRequest = <T>(
    request: (apiUtils: typeof ApiUtils) => Promise<ApiResponse<T>>
) => Promise<ApiResponse<T>>;

export interface AppContextValue {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    authUtils: AuthUtils;
    loadingUtils: LoadingUtils;
    executeApiRequest: ExecuteApiRequest;
    lastDevice: Device | null;
    setLastDevice: Dispatch<SetStateAction<Device | null>>;
    devices: Device[];
    setDevices: Dispatch<SetStateAction<Device[]>>;
}
