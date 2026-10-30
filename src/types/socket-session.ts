export type SocketEntity = "devices" | "whitelist";

export interface SocketSession {
    readonly id: string;
    readonly expiresAt: string;
}

export interface SocketNotification {
    readonly entity: SocketEntity;
    readonly version: string;
}
