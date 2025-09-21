"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import Dock from "@/components/Dock/Dock";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Loading } from "@/components/Loading/Loading";
import { useCollectionsData } from "@/lib/hooks/useCollectionsData";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import styles from "./profile.module.css";
import { User } from "@/lib/types/User";
import { ProfileEditForm } from "@/components/ProfileEditForm/ProfileEditForm";
import {PROFILE_CONFIG} from "@/lib/constants/profileConfig.ts";
import {PageHeader} from "@/components/PageHeader/PageHeader.tsx";
import {UserStats} from "@/components/UserStats/UserStats.tsx";
import {RecentCollectionsSection} from "@/components/RecentCollectionsSection/RecentCollectionsSection.tsx";

// Компонент карточки профиля
const ProfileCard: React.FC<{
    user: User;
    onProfileUpdate: (user: User) => void;
    onError: (error: string) => void;
}> = ({ user, onProfileUpdate, onError }) => (
    <div className={styles["profile-card"]}>
        <div className={styles["profile-info"]}>
            <div className={styles["avatar-section"]}>
                <div className={styles["avatar"]}>
                    <VscAccount size={48} />
                </div>
            </div>

            <ProfileEditForm
                user={user}
                onSuccess={onProfileUpdate}
                onError={onError}
            />
        </div>

        <div className={styles["profile-actions"]}>
            <LogoutButton />
        </div>
    </div>
);

// Основной компонент страницы профиля
const ProfilePage: React.FC = () => {
    const router = useRouter();

    // Используем кастомные хуки
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

    const memberSinceTimestamp = React.useMemo(() =>
            userProfile?.createdAt ? new Date(userProfile.createdAt).getTime() : Date.now(),
        [userProfile?.createdAt]
    );

    // Обработчик ошибок
    const handleError = React.useCallback((errorMessage: string) => {
        setError(errorMessage);
    }, [setError]);

    // Если ошибка загрузки профиля - показываем fallback
    if (!isLoading && (error || !userProfile)) {
        return (
            <div className={styles["page"]}>
                <div className={styles["main-board"]}>
                    <ErrorState
                        title={PROFILE_CONFIG.errorMessages.loadProfile}
                        message={error || PROFILE_CONFIG.errorMessages.profileNotFound}
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
                text={PROFILE_CONFIG.loading.text}
            />

            {!isLoading && userProfile && (
                <>
                    <Dock
                        items={navItems}
                        panelHeight={PROFILE_CONFIG.dock.panelHeight}
                        baseItemSize={PROFILE_CONFIG.dock.baseItemSize}
                        magnification={PROFILE_CONFIG.dock.magnification}
                    />

                    <ClickSpark
                        sparkColor={PROFILE_CONFIG.clickSpark.color}
                        sparkSize={PROFILE_CONFIG.clickSpark.size}
                        sparkRadius={PROFILE_CONFIG.clickSpark.radius}
                        sparkCount={PROFILE_CONFIG.clickSpark.count}
                        duration={PROFILE_CONFIG.clickSpark.duration}
                    >
                        <div className={styles["page"]}>
                            <div className={styles["main-board"]}>
                                <PageHeader
                                    title={PROFILE_CONFIG.page.title}
                                    description={PROFILE_CONFIG.page.description}
                                    variant="centered"
                                />

                                {/* Error message */}
                                {error && (
                                    <div className={styles["error-message"]}>
                                        <p>{error}</p>
                                    </div>
                                )}

                                {/* Profile card */}
                                <ProfileCard
                                    user={userProfile}
                                    onProfileUpdate={handleProfileUpdate}
                                    onError={handleError}
                                />

                                {/* Stats */}
                                <UserStats
                                    totalCollections={collections.length}
                                    totalItems={items.length}
                                    memberSince={memberSinceTimestamp}
                                />

                                {/* Recent Collections */}
                                <RecentCollectionsSection
                                    collections={collections}
                                    items={items}
                                    maxCollections={PROFILE_CONFIG.recentCollections.maxCount}
                                    title={PROFILE_CONFIG.recentCollections.title}
                                    className={styles["collections-preview"]}
                                />
                            </div>
                        </div>
                    </ClickSpark>
                </>
            )}
        </>
    );
};

export default ProfilePage;
