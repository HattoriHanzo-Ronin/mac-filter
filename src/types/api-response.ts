import { ApiErrorResponse } from "./api-error";

/**
 * Base API response
 */
export type ApiResponse<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          error: ApiErrorResponse;
      };
