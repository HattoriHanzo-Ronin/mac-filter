import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { API_URL } from "../constants/config";
import type { ApiResponse } from "../types/api-response";
import type { OperationContextValue } from "../types/operation-context";
import type { SocketNotification } from "../types/socket-session";
import ApiUtils from "../utils/api-utils";
import AuthUtils from "../utils/auth-utils";
import LoadingUtils from "../utils/loading-utils";
import SecureStoreUtils from "../utils/storage/impl/secure-store";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";

const OperationContext = createContext<OperationContextValue>({} as OperationContextValue);
const SOCKET_SESSION_REFRESH_INTERVAL = 600000;

export const useOperationContext = (): OperationContextValue => useContext(OperationContext);

export default function OperationsProvider(props: PropsWithChildren) {
    const { isAuthenticated, setIsAuthenticated, setLoadingState, setUser } = useAppContext();
    const [storage] = useState<SecureStoreUtils>(() => new SecureStoreUtils());
    const [apiUtils] = useState<ApiUtils>(() => new ApiUtils(API_URL, storage));
    const [authUtils] = useState<AuthUtils>(() => new AuthUtils(setIsAuthenticated, setUser, apiUtils, storage));
    const [loadingUtils] = useState<LoadingUtils>(() => new LoadingUtils(setLoadingState));
    const addSocketChangeListener = useCallback(
        (listener: (notification: SocketNotification) => void): (() => void) => apiUtils.addSocketChangeListener(listener),
        [apiUtils]
    );
    const executeApiRequest = useCallback(async function executeApiRequest<T>(request: (apiUtils: ApiUtils) => Promise<ApiResponse<T>>, isBackground = false): Promise<ApiResponse<T>> {
        return (async function execute(canRetry: boolean): Promise<ApiResponse<T>> {
            const executeRequest = async (): Promise<ApiResponse<T>> => {
                const result = await request(apiUtils);
                if (!result.success) {
                    const { code, message } = result.error;
                    if (canRetry && code === "INVALID_TOKEN" && (await authUtils.restoreSession())) {
                        return execute(false);
                    }

                    if (!isBackground) {
                        UiUtils.showMessage(message);
                    }
                }

                return result;
            };
            return isBackground ? executeRequest() : loadingUtils.run(executeRequest);
        })(true);
    }, [apiUtils, authUtils, loadingUtils]);
    const contextValue: OperationContextValue = { addSocketChangeListener, authUtils, loadingUtils, executeApiRequest };

    useEffect(() => {
        let refreshInterval: ReturnType<typeof setInterval> | null = null;
        const stopSocketSession = (): void => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }

            apiUtils.suspendSocketSession();
        };
        const startSocketSession = (): void => {
            if (!isAuthenticated || refreshInterval) {
                return;
            }

            void executeApiRequest((apiUtils) => apiUtils.refreshSocketSession(), true);
            refreshInterval = setInterval(
                () => void executeApiRequest((apiUtils) => apiUtils.refreshSocketSession(), true),
                SOCKET_SESSION_REFRESH_INTERVAL
            );
        };
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                startSocketSession();
                return;
            }

            stopSocketSession();
        });
        if (AppState.currentState !== "background" && AppState.currentState !== "inactive") {
            startSocketSession();
        }

        return () => {
            subscription.remove();
            stopSocketSession();
        };
    }, [apiUtils, executeApiRequest, isAuthenticated]);

    useEffect(
        () =>
            apiUtils.addSocketReconnectListener(() => {
                void executeApiRequest((apiUtils) => apiUtils.refreshSocketSession(), true);
            }),
        [apiUtils, executeApiRequest]
    );

    return <OperationContext.Provider value={contextValue}>{props.children}</OperationContext.Provider>;
}
