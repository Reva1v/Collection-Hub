"use client";

import * as React from "react";
import { VscEdit, VscCheck, VscClose } from "react-icons/vsc";
import { User } from "@/lib/types/User";
import { updateUser } from "@/lib/user/actions";
import styles from "./ProfileEditForm.module.css";

interface ProfileEditFormProps {
    user: User;
    onSuccess: (updatedUser: User) => void;
    onError: (error: string) => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
                                                                    user,
                                                                    onSuccess,
                                                                    onError
                                                                }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        username: user.username,
        email: user.email,
    });

    React.useEffect(() => {
        setEditForm({
            username: user.username,
            email: user.email,
        });
    }, [user]);

    const handleEditToggle = React.useCallback(() => {
        if (isEditing) {
            setEditForm({
                username: user.username,
                email: user.email,
            });
        }
        setIsEditing(!isEditing);
        onError(''); // Очищаем ошибки
    }, [isEditing, user, onError]);

    const handleSave = React.useCallback(async () => {
        setIsSaving(true);
        onError('');

        try {
            const formData = new FormData();
            formData.append('username', editForm.username);
            formData.append('email', editForm.email);

            const result = await updateUser(user.id, formData);

            if (result.success && result.user) {
                onSuccess(result.user);
                setIsEditing(false);
            } else {
                onError(result.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            onError("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    }, [editForm, user.id, onSuccess, onError]);

    const handleInputChange = React.useCallback((field: 'username' | 'email') =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEditForm((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
        }, []
    );

    return (
        <div className={styles["user-details"]}>
            <div className={styles["name-section"]}>
                {isEditing ? (
                    <input
                        type="text"
                        value={editForm.username}
                        onChange={handleInputChange('username')}
                        className={styles["edit-input"]}
                        placeholder="Your username"
                        disabled={isSaving}
                    />
                ) : (
                    <h2 className={styles["user-name"]}>
                        {user.username}
                    </h2>
                )}

                <div className={styles["edit-buttons"]}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={styles["save-button"]}
                            >
                                <VscCheck size={16} />
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleEditToggle}
                                disabled={isSaving}
                                className={styles["cancel-button"]}
                            >
                                <VscClose size={16} />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className={styles["edit-button"]}
                        >
                            <VscEdit size={16} />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className={styles["email-section"]}>
                {isEditing ? (
                    <input
                        type="email"
                        value={editForm.email}
                        onChange={handleInputChange('email')}
                        className={styles["edit-input"]}
                        placeholder="Your email"
                        disabled={isSaving}
                    />
                ) : (
                    <p className={styles["user-email"]}>{user.email}</p>
                )}
            </div>

            <div className={styles["join-date"]}>
                <p>
                    Member since:{" "}
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};
