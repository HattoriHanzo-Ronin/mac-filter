export interface ApiValidationErrorDetail {
    field?: string;
    message: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
    message: string;
    code: string;
    details?: ApiValidationErrorDetail[];
}

export type ValidationErrors<T extends object> = Partial<Record<keyof T, string[]>>;
