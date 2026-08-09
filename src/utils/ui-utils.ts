import { ToastAndroid } from "react-native";
import { ApiValidationErrorDetail } from "../types/api-error";
import { ValidationErrors } from "../types/ui";

/**
 * UI utilities
 *
 * @author HattoriHanzo-Ronin
 */
export default class UiUtils {
    static makeName(name: string, type: string) {
        return `${name} ${type !== "" ? `( ${type} )` : ""}`;
    }

    static firstToUpper(value: string) {
        return value.replace(value.charAt(0), value.charAt(0).toUpperCase());
    }

    /**
     * Displays a message
     *
     * @param message Message
     * @param duration Display duration
     */
    static showMessage(message: string, duration: number = ToastAndroid.LONG): void {
        ToastAndroid.show(message, duration);
    }

    /**
     * Maps API validation details to the corresponding form fields
     *
     * @param details API validation details
     * @returns Validation messages keyed by form field
     */
    static mapValidationErrors<T extends object>(details: ApiValidationErrorDetail[]): ValidationErrors<T> {
        const validationErrors: ValidationErrors<T> = {};
        for (const { field, message } of details) {
            if (field) {
                const key = field as keyof T;
                validationErrors[key] = [...(validationErrors[key] ?? []), `- ${message}`];
            }
        }
        return validationErrors;
    }

    /**
     * Removes the validation errors for a form field
     *
     * @param validationErrors Form validation errors
     * @param field Form field
     * @returns Validation errors without the specified field
     */
    static removeValidationError<T extends object>(
        validationErrors: ValidationErrors<T>,
        field: keyof T
    ): ValidationErrors<T> {
        const updatedErrors = { ...validationErrors };
        delete updatedErrors[field];
        return updatedErrors;
    }
}
