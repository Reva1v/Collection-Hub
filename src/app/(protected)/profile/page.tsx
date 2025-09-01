"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import {
    VscAccount,
    VscArchive,
    VscHome,
    VscEdit,
    VscCheck,
    VscClose,
} from "react-icons/vsc";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Dock from "@/components/Dock/Dock";
import LogoutButton from "@/components/LogoutButton/LogoutButton";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar?: string;
    createdAt: string;
    totalCollections: number;
    totalItems: number;
}

interface CollectionPreview {
    id: string;
    name: string;
    description?: string;
    itemsCount: number;
}

const ProfilePage: React.FC = () => {
    const router = useRouter();

    // Mock collections
    const [collections] = React.useState<CollectionPreview[]>([
        {
            id: "1",
            name: "Books",
            description: "My favorite books",
            itemsCount: 12,
        },
        {
            id: "2",
            name: "Vinyls",
            description: "Classic rock vinyl collection",
            itemsCount: 5,
        },
        {
            id: "3",
            name: "Games",
            description: "Retro and modern games",
            itemsCount: 20,
        },
    ]);

    // Mock user profile
    const [userProfile, setUserProfile] = React.useState<UserProfile>({
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Passionate collector and organizer. Love discovering new things.",
        avatar: "",
        createdAt: "2024-01-15",
        totalCollections: collections.length,
        totalItems: collections.reduce((sum, c) => sum + c.itemsCount, 0),
    });

    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        name: userProfile.name,
        bio: userProfile.bio,
    });

    const handleEditToggle = () => {
        if (isEditing) {
            setEditForm({
                name: userProfile.name,
                bio: userProfile.bio,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // fake API delay
            setUserProfile((prev) => ({
                ...prev,
                name: editForm.name,
                bio: editForm.bio,
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const items = [
        {
            icon: <VscHome size={18} />,
            label: "Home",
            href: "/",
            onClick: (router: AppRouterInstance) => () => router.push("/"),
        },
        {
            icon: <VscArchive size={18} />,
            label: "Collections",
            href: "/collections",
            onClick: (router: AppRouterInstance) => () => router.push("/collections"),
        },
        {
            icon: <VscAccount size={18} />,
            label: "Profile",
            href: "/profile",
            onClick: (router: AppRouterInstance) => () => router.push("/profile"),
        },
    ];

    return (
        <>
            <Dock
                items={items.map((item) => ({
                    ...item,
                    onClick: item.onClick(router),
                }))}
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
                        <div className={styles["profile-header"]}>
                            <h1>Your Profile</h1>
                            <p>Manage your personal information and preferences</p>
                        </div>

                        {/* Profile card */}
                        <div className={styles["profile-card"]}>
                            <div className={styles["profile-info"]}>
                                <div className={styles["avatar-section"]}>
                                    <div className={styles["avatar"]}>
                                        {userProfile.avatar ? (
                                            <img src={userProfile.avatar} alt="Profile" />
                                        ) : (
                                            <VscAccount size={48} />
                                        )}
                                    </div>
                                </div>

                                <div className={styles["user-details"]}>
                                    <div className={styles["name-section"]}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className={styles["edit-input"]}
                                                placeholder="Your name"
                                            />
                                        ) : (
                                            <h2 className={styles["user-name"]}>
                                                {userProfile.name}
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

                                    <p className={styles["user-email"]}>{userProfile.email}</p>

                                    <div className={styles["bio-section"]}>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        bio: e.target.value,
                                                    }))
                                                }
                                                className={styles["edit-textarea"]}
                                                placeholder="Tell us about yourself..."
                                                rows={3}
                                            />
                                        ) : (
                                            <p className={styles["user-bio"]}>
                                                {userProfile.bio || "No bio added yet."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles["profile-actions"]}>
                                <LogoutButton />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className={styles["stats-section"]}>
                            <h2>Your Statistics</h2>
                            <div className={styles["stats-grid"]}>
                                <div className={styles["stat-card"]}>
                                    <div className={styles["stat-icon"]}>📚</div>
                                    <div className={styles["stat-info"]}>
                                        <div className={styles["stat-number"]}>
                                            {userProfile.totalCollections}
                                        </div>
                                        <div className={styles["stat-label"]}>Collections</div>
                                    </div>
                                </div>

                                <div className={styles["stat-card"]}>
                                    <div className={styles["stat-icon"]}>📦</div>
                                    <div className={styles["stat-info"]}>
                                        <div className={styles["stat-number"]}>
                                            {userProfile.totalItems}
                                        </div>
                                        <div className={styles["stat-label"]}>Total Items</div>
                                    </div>
                                </div>

                                <div className={styles["stat-card"]}>
                                    <div className={styles["stat-icon"]}>📅</div>
                                    <div className={styles["stat-info"]}>
                                        <div className={styles["stat-number"]}>
                                            {Math.floor(
                                                (Date.now() -
                                                    new Date(userProfile.createdAt).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                            )}
                                        </div>
                                        <div className={styles["stat-label"]}>Days Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Collections */}
                        <div className={styles["recent-collections"]}>
                            <h2>Recent Collections</h2>
                            {collections.length > 0 ? (
                                <div className={styles["collections-preview"]}>
                                    {collections.slice(0, 3).map((collection) => (
                                        <div
                                            key={collection.id}
                                            className={styles["collection-preview"]}
                                        >
                                            <div className={styles["collection-info"]}>
                                                <h4>{collection.name}</h4>
                                                <p>{collection.description || "No description"}</p>
                                                <span className={styles["item-count"]}>
                          {collection.itemsCount} items
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles["empty-state"]}>
                                    <p>No collections yet. Create your first collection!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ClickSpark>
        </>
    );
};

export default ProfilePage;
