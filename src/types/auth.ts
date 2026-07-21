type UserRole = "ADMIN" | "FTP" | "NET";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export type LogoutRequest = RefreshTokenRequest;

interface AuthResponse {
    user: {
        id: string;
        username: string;
        roles: UserRole[];
        scope?: UserRole[];
    };
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = AuthResponse;

export type RefreshTokenResponse = AuthResponse;
