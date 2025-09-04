export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date | null;
}

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserData {
    username: string;
    email: string;
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
