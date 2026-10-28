import type ApiUtils from "../utils/api-utils";
import type AuthUtils from "../utils/auth-utils";
import type LoadingUtils from "../utils/loading-utils";
import type { ApiResponse } from "./api-response";

export type ExecuteApiRequest = <T>(
    request: (apiUtils: ApiUtils) => Promise<ApiResponse<T>>,
    isBackground?: boolean
) => Promise<ApiResponse<T>>;

export interface OperationContextValue {
    apiUtils: ApiUtils;
    authUtils: AuthUtils;
    loadingUtils: LoadingUtils;
    executeApiRequest: ExecuteApiRequest;
}
