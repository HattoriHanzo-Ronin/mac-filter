/**
 * API error response
 */
export interface ApiErrorResponse {
    message: string;
    code: string;
    details?: { field: string; message: string }[];
}
