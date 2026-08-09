import { ApiError } from "./api-error";

/**
 * Successful API response
 */
export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
};

/**
 * Failed API response
 */
export type ApiErrorResponse = {
    success: false;
    error: ApiError;
};

/**
 * Base API response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
