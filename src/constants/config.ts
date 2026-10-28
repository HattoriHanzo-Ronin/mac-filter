const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_API_URL es obligatoria");
}

export const API_URL: string = apiUrl;
