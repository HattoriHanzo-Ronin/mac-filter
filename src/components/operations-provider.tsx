import { createContext, type PropsWithChildren, useCallback, useContext, useState } from "react";
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

export const useOperationContext = (): OperationContextValue => useContext(OperationContext);

export default function OperationsProvider(props: PropsWithChildren) {
    const { setIsAuthenticated, setLoadingState, setUser } = useAppContext();
    const [storage] = useState<SecureStoreUtils>(() => new SecureStoreUtils());
    const [apiUtils] = useState<ApiUtils>(() => new ApiUtils(API_URL));
    const [authUtils] = useState<AuthUtils>(() => new AuthUtils(setIsAuthenticated, setUser, apiUtils, storage));
    const [loadingUtils] = useState<LoadingUtils>(() => new LoadingUtils(setLoadingState));
    const executeApiRequest = useCallback(async function executeApiRequest<T>(request: (apiUtils: ApiUtils) => Promise<ApiResponse<T>>, isBackground = false): Promise<ApiResponse<T>> {
        return (async function execute(canRetry: boolean): Promise<ApiResponse<T>> {
            const executeRequest = async (): Promise<ApiResponse<T>> => {
                const result = await request(apiUtils);
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
    }, [apiUtils, authUtils, loadingUtils]);
    const contextValue: OperationContextValue = { apiUtils, authUtils, loadingUtils, executeApiRequest };

    return <OperationContext.Provider value={contextValue}>{props.children}</OperationContext.Provider>;
}
