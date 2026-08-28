interface Username {
    username: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export type UpdateUsernameRequest = Username;
export type UpdateUsernameResponse = Username;