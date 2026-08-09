import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";
import { Storage } from "./storage";

/**
 * Secure storage utilities
 *
 * @author HattoriHanzo-Ronin
 */
export default class SecureStoreUtils implements Storage {
    /**
     * Stores a value securely
     *
     * @param key Storage key
     * @param payload Value to store
     */
    async set<T>(key: string, payload: T): Promise<void> {
        await setItemAsync(key, JSON.stringify(payload));
    }

    /**
     * Returns a securely stored value
     *
     * @param key Storage key
     * @returns Stored value or null
     */
    async get<T>(key: string): Promise<T | null> {
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
    async delete(key: string): Promise<void> {
        await deleteItemAsync(key);
    }
}
