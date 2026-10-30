export type VersionEntity = "devices" | "whitelist";

export interface SocketSession {
    id: string;
    expiresAt: string;
    activityInterval: number;
}

export type SocketVersions = Partial<Record<VersionEntity, string>>;
