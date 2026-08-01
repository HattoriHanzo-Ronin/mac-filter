import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";

/**
 * Secure storage utilities
 *
 * @author HattoriHanzo-Ronin
 */
export default class SecureStoreUtils {
    /**
     * Stores a value securely
     *
     * @param key Storage key
     * @param payload Value to store
     */
    static async set<T>(key: string, payload: T): Promise<void> {
        await setItemAsync(key, JSON.stringify(payload));
    }

    /**
     * Returns a securely stored value
     *
     * @param key Storage key
     * @returns Stored value or null
     */
    static async get<T>(key: string): Promise<T | null> {
        const result = await getItemAsync(key);
        if (result) {
            return JSON.parse(result);
        }

        return null;
    }

    /**
     * Deletes a securely stored value
     *
     * @param key Storage key
     */
    static async delete(key: string): Promise<void> {
        await deleteItemAsync(key);
    }
}
