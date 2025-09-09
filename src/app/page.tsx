"use client";

import * as React from "react";
import {useRouter} from "next/navigation";
import styles from "@/app/Home.module.css";
import ClickSpark from "@/components/ClickSpark/ClickSpark.tsx";
import { VscArchive, VscAdd } from "react-icons/vsc";
import Dock from "@/components/Dock/Dock.tsx";
import {ErrorState} from "@/components/ErrorState/ErrorState.tsx";
import {Loading} from "@/components/Loading/Loading.tsx";
import {useCollectionsData} from "@/lib/hooks/useCollectionsData.ts";
import {NAV_ITEMS} from "@/lib/constants/navigation";
import {CollectionsList} from "@/components/CollectionsList/CollectionsList.tsx";

interface HomePageProps {
    user: { username?: string } | null;
    error?: string | null;
}

const HomePage: React.FC<HomePageProps> = ({user, error: propError}) => {
    const router = useRouter();
    const {
        collections,
        items,
        isLoading,
        error: dataError,
        refetch
    } = useCollectionsData();

    const navItems = React.useMemo(() =>
            NAV_ITEMS.map(item => ({
                ...item,
                onClick: item.onClick(router)
            })),
        [router]
    );

    // Объединяем ошибки из пропов и данных
    const combinedError = propError || dataError;

    // Вычисляем статистику
    const stats = React.useMemo(() => {
        const totalCollections = collections?.length || 0;
        const totalItems = items?.length || 0;
        const recentlyAdded = items?.filter(item => {
            const createdAt = new Date(item.createdAt || Date.now());
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return createdAt > weekAgo;
        }).length || 0;

        return {
            totalCollections,
            totalItems,
            recentlyAdded
        };
    }, [collections, items]);

    // Если ошибка загрузки - показываем fallback
    if (!isLoading && combinedError) {
        return (
            <div className={styles["page"]}>
                <div className={styles["main-board"]}>
                    <ErrorState
                        title="Error loading home page"
                        message={combinedError}
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
                text="Loading home page..."
            />

            {!isLoading && (
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
                                <header className={styles["hero"]}>
                                    <h1 className={styles["title"]}>
                                        Welcome back{user?.username ? `, ${user.username}` : ""}!
                                    </h1>
                                    <p className={styles["subtitle"]}>
                                        Manage your collections and discover amazing items
                                    </p>
                                </header>

                                <section className={styles["quick-actions"]}>
                                    <h2>Quick Actions</h2>
                                    <div className={styles["actions-grid"]}>
                                        <div
                                            className={styles["action-card"]}
                                            onClick={() => router.push("/collections")}
                                        >
                                            <div className={styles["card-icon"]}>
                                                <VscArchive size={32}/>
                                            </div>
                                            <h3>My Collections</h3>
                                            <p>Browse and manage your item collections</p>
                                            <button className={styles["action-button"]}>View Collections</button>
                                        </div>

                                        <div
                                            className={styles["action-card"]}
                                            onClick={() => router.push("/collections")}
                                        >
                                            <div className={styles["card-icon"]}>
                                                <VscAdd size={32}/>
                                            </div>
                                            <h3>Create Collection</h3>
                                            <p>Start a new collection to organize your items</p>
                                            <button className={styles["action-button"]}>Create New</button>
                                        </div>
                                    </div>
                                </section>

                                <section className={styles["quick-stats"]}>
                                    <h2>Quick Overview</h2>
                                    <div className={styles["stats-grid"]}>
                                        <div className={styles["stat-card"]}>
                                            <div className={styles["stat-icon"]}>📚</div>
                                            <div className={styles["stat-info"]}>
                                                <div className={styles["stat-number"]}>{stats.totalCollections}</div>
                                                <div className={styles["stat-label"]}>Collections</div>
                                            </div>
                                        </div>

                                        <div className={styles["stat-card"]}>
                                            <div className={styles["stat-icon"]}>📦</div>
                                            <div className={styles["stat-info"]}>
                                                <div className={styles["stat-number"]}>{stats.totalItems}</div>
                                                <div className={styles["stat-label"]}>Total Items</div>
                                            </div>
                                        </div>

                                        <div className={styles["stat-card"]}>
                                            <div className={styles["stat-icon"]}>🆕</div>
                                            <div className={styles["stat-info"]}>
                                                <div className={styles["stat-number"]}>{stats.recentlyAdded}</div>
                                                <div className={styles["stat-label"]}>Recently Added</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

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

export default HomePage;
