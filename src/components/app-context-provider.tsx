import { createContext, PropsWithChildren, useContext, useState } from "react";
import { AuthUser } from "../types/auth";
import AuthUtils from "../utils/auth-utils";

interface AppContextValue {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    authUtils: AuthUtils;
}

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AppContext);

export default function AppContextProvider(props: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authUtils] = useState(() => new AuthUtils(setIsAuthenticated, setUser, setIsLoading));
    const contextValue: AppContextValue = { isAuthenticated, user, isLoading, authUtils };
    return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}
