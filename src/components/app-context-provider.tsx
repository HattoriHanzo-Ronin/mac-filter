import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import AuthUtils from "../utils/auth-utils";
import LoadingUtils from "../utils/loading-utils";
import SecureStoreUtils from "../utils/storage/secure-store-utils";
import ApiUtils from "../utils/api-utils";
import { AppContextValue } from "../types/app-context";
import { ApiResponse } from "../types/api-response";
import { AuthUser } from "../types/auth";
import { Device } from "../types/devices";
import UiUtils from "../utils/ui-utils";

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export default function AppContextProvider(props: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [storage] = useState(() => new SecureStoreUtils());
    const [authUtils] = useState(() => new AuthUtils(setIsAuthenticated, setUser, storage));
    const [loadingUtils] = useState(() => new LoadingUtils(setIsLoading));
    const [lastDevice, setLastDevice] = useState<Device | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);

    /**
     * Executes an API request and retries it once after restoring the session
     *
     * @param request API request
     * @param isBackground Whether to execute without changing the loading state
     * @returns API response
     */
    const executeApiRequest = useCallback(async function executeApiRequest<T>(
        request: (apiUtils: typeof ApiUtils) => Promise<ApiResponse<T>>,
        isBackground = false
    ): Promise<ApiResponse<T>> {
        return (async function execute(canRetry: boolean): Promise<ApiResponse<T>> {
            const executeRequest = async (): Promise<ApiResponse<T>> => {
                const result = await request(ApiUtils);
                if (!result.success) {
                    const { code, message } = result.error;
                    if (canRetry && code === "INVALID_TOKEN" && (await authUtils.restoreSession())) {
                        return execute(false);
                    }

                    UiUtils.showMessage(message);
                }

                return result;
            };
            return isBackground ? executeRequest() : loadingUtils.run(executeRequest);
        })(true);
    }, [authUtils, loadingUtils]);
    const contextValue: AppContextValue = {
        isAuthenticated,
        user,
        isLoading,
        authUtils,
        loadingUtils,
        executeApiRequest,
        lastDevice,
        setLastDevice,
        devices,
        setDevices
    };

    return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
