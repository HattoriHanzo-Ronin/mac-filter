import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "../constants/config";
import type { ApiResponse } from "../types/api-response";
import type { OperationContextValue } from "../types/operation-context";
import ApiUtils from "../utils/api-utils";
import AuthUtils from "../utils/auth-utils";
import LoadingUtils from "../utils/loading-utils";
import SecureStoreUtils from "../utils/storage/impl/secure-store";
import UiUtils from "../utils/ui-utils";
import { useAppContext } from "./app-context-provider";

const OperationContext = createContext<OperationContextValue>({} as OperationContextValue);
const ACTIVITY_TIMEOUT = 900000;

export const useOperationContext = (): OperationContextValue => useContext(OperationContext);

export default function OperationsProvider(props: PropsWithChildren) {
    const { setIsAuthenticated, setLoadingState, setUser } = useAppContext();
    const [storage] = useState<SecureStoreUtils>(() => new SecureStoreUtils());
    const [apiUtils] = useState<ApiUtils>(() => new ApiUtils(API_URL, storage));
    const [authUtils] = useState<AuthUtils>(() => new AuthUtils(setIsAuthenticated, setUser, apiUtils, storage));
    const [loadingUtils] = useState<LoadingUtils>(() => new LoadingUtils(setLoadingState));
    const activityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetActivityTimeout = useCallback((): void => {
        if (activityTimeout.current) {
            clearTimeout(activityTimeout.current);
        }

        void apiUtils.resumeSocketSession();
        activityTimeout.current = setTimeout(() => apiUtils.suspendSocketSession(), ACTIVITY_TIMEOUT);
    }, [apiUtils]);
    const executeApiRequest = useCallback(async function executeApiRequest<T>(request: (apiUtils: ApiUtils) => Promise<ApiResponse<T>>, isBackground = false): Promise<ApiResponse<T>> {
        if (!isBackground) {
            resetActivityTimeout();
        }
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
    }, [apiUtils, authUtils, loadingUtils, resetActivityTimeout]);
    const contextValue: OperationContextValue = { apiUtils, authUtils, loadingUtils, executeApiRequest };

    useEffect(() => () => {
        if (activityTimeout.current) {
            clearTimeout(activityTimeout.current);
        }

        apiUtils.suspendSocketSession();
    }, [apiUtils]);

    return <OperationContext.Provider value={contextValue}>{props.children}</OperationContext.Provider>;
}
