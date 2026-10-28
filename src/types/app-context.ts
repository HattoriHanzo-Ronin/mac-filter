import type { Dispatch, SetStateAction } from "react";
import type { AuthUser } from "./auth";
import type { Device } from "./devices";

/** Shared application state and operations */
export interface AppContextValue {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    user: AuthUser | null;
    setUser: Dispatch<SetStateAction<AuthUser | null>>;
    isLoading: boolean;
    setLoadingState: (isLoading: boolean) => void;
    loadingStartedAt: number | null;
    lastDevice: Device | null;
    setLastDevice: Dispatch<SetStateAction<Device | null>>;
    devices: Device[];
    setDevices: Dispatch<SetStateAction<Device[]>>;
}
