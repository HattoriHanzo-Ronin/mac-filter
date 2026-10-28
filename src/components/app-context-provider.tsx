import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import type { AppContextValue } from "../types/app-context";
import type { AuthUser } from "../types/auth";
import type { Device } from "../types/devices";

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export default function AppContextProvider(props: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingStartedAt, setLoadingStartedAt] = useState<number | null>(null);
    const setLoadingState = useCallback((loading: boolean): void => {
        setIsLoading(loading);
        setLoadingStartedAt(loading ? Date.now() : null);
    }, []);
    const [lastDevice, setLastDevice] = useState<Device | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);

    const contextValue: AppContextValue = {
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isLoading,
        setLoadingState,
        loadingStartedAt,
        lastDevice,
        setLastDevice,
        devices,
        setDevices
    };

    return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextValue => useContext(AppContext);
