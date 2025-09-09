"use client";

import * as React from "react";
import {useRouter} from "next/navigation";
import styles from "./profile.module.css";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import {
    VscAccount,
    VscEdit,
    VscCheck,
    VscClose,
} from "react-icons/vsc";
import Dock from "@/components/Dock/Dock";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import {CollectionsList} from "@/components/CollectionsList/CollectionsList";
import {ErrorState} from "@/components/ErrorState/ErrorState";
import {Loading} from "@/components/Loading/Loading";
import {useCollectionsData} from "@/lib/hooks/useCollectionsData";
import {User} from "@/lib/types/User.ts";
import {getCurrentUser, updateUser} from "@/lib/user/actions.ts";
import {NAV_ITEMS} from "@/lib/constants/navigation";

// Кастомный хук для работы с профилем пользователя
const useUserProfile = () => {
    const [userProfile, setUserProfile] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchUserProfile = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const user = await getCurrentUser();

            if (!user) {
                setError("Failed to load user profile");
                return;
            }

            setUserProfile(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError("Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return {
        userProfile,
        isLoading,
        error,
        setUserProfile,
        setError,
        refetch: fetchUserProfile
    };
};

// Компонент для редактирования профиля
const ProfileEditForm: React.FC<{
    user: User;
    onSuccess: (updatedUser: User) => void;
    onError: (error: string) => void;
}> = ({ user, onSuccess, onError }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        username: user.username,
        email: user.email,
    });

    // Синхронизируем форму с пользователем
    React.useEffect(() => {
        setEditForm({
            username: user.username,
            email: user.email,
        });
    }, [user]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Отменяем изменения
            setEditForm({
                username: user.username,
                email: user.email,
            });
        }
        setIsEditing(!isEditing);
        onError(''); // Очищаем ошибки
    };

    const handleSave = async () => {
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
    };

    return (
        <div className={styles["user-details"]}>
            <div className={styles["name-section"]}>
                {isEditing ? (
                    <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }
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
                                <VscCheck size={16}/>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleEditToggle}
                                disabled={isSaving}
                                className={styles["cancel-button"]}
                            >
                                <VscClose size={16}/>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className={styles["edit-button"]}
                        >
                            <VscEdit size={16}/>
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
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
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

// Компонент статистики
const UserStats: React.FC<{
    totalCollections: number;
    totalItems: number;
    memberSince: string | number;
}> = ({ totalCollections, totalItems, memberSince }) => {
    const daysActive = React.useMemo(() => {
        const createdDate = new Date(memberSince).getTime();
        return Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
    }, [memberSince]);

    return (
        <div className={styles["stats-section"]}>
            <h2>Your Statistics</h2>
            <div className={styles["stats-grid"]}>
                <div className={styles["stat-card"]}>
                    <div className={styles["stat-icon"]}>📚</div>
                    <div className={styles["stat-info"]}>
                        <div className={styles["stat-number"]}>{totalCollections}</div>
                        <div className={styles["stat-label"]}>Collections</div>
                    </div>
                </div>

                <div className={styles["stat-card"]}>
                    <div className={styles["stat-icon"]}>📦</div>
                    <div className={styles["stat-info"]}>
                        <div className={styles["stat-number"]}>{totalItems}</div>
                        <div className={styles["stat-label"]}>Total Items</div>
                    </div>
                </div>

                <div className={styles["stat-card"]}>
                    <div className={styles["stat-icon"]}>📅</div>
                    <div className={styles["stat-info"]}>
                        <div className={styles["stat-number"]}>{daysActive}</div>
                        <div className={styles["stat-label"]}>Days Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Основной компонент страницы профиля
const ProfilePage: React.FC = () => {
    const router = useRouter();

    // Используем наши кастомные хуки
    const {
        collections,
        items,
        isLoading: collectionsLoading
    } = useCollectionsData();

    const {
        userProfile,
        isLoading: profileLoading,
        error,
        setUserProfile,
        setError,
        refetch
    } = useUserProfile();

    // Общее состояние загрузки
    const isLoading = profileLoading || collectionsLoading;

    // Мемоизированные значения
    const navItems = React.useMemo(() =>
            NAV_ITEMS.map((item) => ({
                ...item,
                onClick: item.onClick(router),
            })),
        [router]
    );

    const handleProfileUpdate = React.useCallback((updatedUser: User) => {
        setUserProfile(updatedUser);
    }, [setUserProfile]);

    // Если ошибка загрузки профиля - показываем fallback
    if (!isLoading && (error || !userProfile)) {
        return (
            <div className={styles["page"]}>
                <div className={styles["main-board"]}>
                    <ErrorState
                        title="Unable to load profile"
                        message={error || "Profile not found. Please try again."}
                        onRetry={refetch}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <Loading
                isInitialized={!isLoading}
                text="Loading profile..."
            />

            {!isLoading && userProfile && (
                <>
                    <Dock
                        items={navItems}
                        panelHeight={68}
                        baseItemSize={50}
                        magnification={70}
                    />
                    <ClickSpark
                        sparkColor="#fff"
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                    >
                        <div className={styles["page"]}>
                            <div className={styles["main-board"]}>
                                <header className={styles["profile-header"]}>
                                    <h1>Your Profile</h1>
                                    <p>Manage your personal information and preferences</p>
                                </header>

                                {/* Error message */}
                                {error && (
                                    <div className={styles["error-message"]}>
                                        <p>{error}</p>
                                    </div>
                                )}

                                {/* Profile card */}
                                <div className={styles["profile-card"]}>
                                    <div className={styles["profile-info"]}>
                                        <div className={styles["avatar-section"]}>
                                            <div className={styles["avatar"]}>
                                                <VscAccount size={48}/>
                                            </div>
                                        </div>

                                        <ProfileEditForm
                                            user={userProfile}
                                            onSuccess={handleProfileUpdate}
                                            onError={setError}
                                        />
                                    </div>

                                    <div className={styles["profile-actions"]}>
                                        <LogoutButton/>
                                    </div>
                                </div>

                                {/* Stats */}
                                <UserStats
                                    totalCollections={collections.length}
                                    totalItems={items.length}
                                    memberSince={userProfile.createdAt ? new Date(userProfile.createdAt).getTime() : Date.now()}
                                />

                                {/* Recent Collections */}
                                <section className={styles["recent-collections"]}>
                                    <h2>Recent Collections</h2>
                                    {collections.length > 0 ? (
                                        <CollectionsList
                                            collections={collections.slice(0, 3)}
                                            items={items}
                                            showHeader={false}
                                            className={styles["collections-preview"]}
                                        />
                                    ) : (
                                        <div className={styles["empty-state"]}>
                                            <p>No collections yet. Create your first collection!</p>
                                            <button
                                                onClick={() => router.push('/collections')}
                                                className={styles["create-button"]}
                                            >
                                                Create Collection
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </ClickSpark>
                </>
            )}
        </>
    );
};

export default ProfilePage;
