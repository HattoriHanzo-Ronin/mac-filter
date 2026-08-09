export interface ApiValidationErrorDetail {
    field?: string;
    message: string;
}

/**
 * API error
 */
export interface ApiError {
    message: string;
    code: string;
    details?: ApiValidationErrorDetail[];
}
