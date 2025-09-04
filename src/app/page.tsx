"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/Home.module.css";
import ClickSpark from "@/components/ClickSpark/ClickSpark.tsx";
import { VscArchive, VscAdd } from "react-icons/vsc";
import Dock from "@/components/Dock/Dock.tsx";
import { Collection } from "@/lib/types/Collection";
import {getCollections} from "@/lib/collections/actions.ts";
import {getItems} from "@/lib/items/actions.ts";
import {Item} from "@/lib/types/Item.ts";
import {NAV_ITEMS} from "@/lib/constants/navigation";

interface HomePageProps {
    user: { username?: string } | null;
    error?: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ user, error }) => {
    const router = useRouter();

    const [collections, setCollections] = React.useState<Collection[]>([]);
    const [collectionsItems, setCollectionsItems] = React.useState<Item[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [collectionsData, itemsData] = await Promise.all([
                    getCollections(),
                    getItems()
                ]);
                setCollections(collectionsData || []);
                setCollectionsItems(itemsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Статистика
    const totalCollections = collections?.length || 0;
    const totalItems = collectionsItems?.length || 0;
    const recentlyAdded =
        collectionsItems?.filter((item: Item) => {
            const createdAt = new Date(item.createdAt || Date.now());
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return createdAt > weekAgo;
        }).length || 0;

    // Ошибки
    if (error) {
        return (
            <div className={styles["page"]}>
                <div className={styles["error-state"]}>
                    <h2>Error loading data</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Dock
                items={NAV_ITEMS.map((item) => ({
                    ...item,
                    onClick: item.onClick(router),
                }))}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />
            <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <div className={styles["page"]}>
                    <div className={styles["main-board"]}>
                        {/* Hero */}
                        <div className={styles["hero"]}>
                            <h1 className={styles["title"]}>
                                Welcome back{user?.username ? `, ${user.username}` : ""}!
                            </h1>
                            <p className={styles["subtitle"]}>
                                Manage your collections and discover amazing items
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className={styles["quick-actions"]}>
                            <h2>Quick Actions</h2>
                            <div className={styles["actions-grid"]}>
                                <div
                                    className={styles["action-card"]}
                                    onClick={() => router.push("/collections")}
                                >
                                    <div className={styles["card-icon"]}>
                                        <VscArchive size={32} />
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
                                        <VscAdd size={32} />
                                    </div>
                                    <h3>Create Collection</h3>
                                    <p>Start a new collection to organize your items</p>
                                    <button className={styles["action-button"]}>Create New</button>
                                </div>

                            </div>
                        </div>

                        {/* Stats */}
                        <div className={styles["quick-stats"]}>
                            <h2>Quick Overview</h2>
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
                                    <div className={styles["stat-icon"]}>🆕</div>
                                    <div className={styles["stat-info"]}>
                                        <div className={styles["stat-number"]}>{recentlyAdded}</div>
                                        <div className={styles["stat-label"]}>Recently Added</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Collections */}
                        {collections && collections.length > 0 && (
                            <div className={styles["recent-collections"]}>
                                <h2>Recent Collections</h2>
                                <div className={styles["collections-preview"]}>
                                    {collections.slice(0, 3).map((collection) => (
                                        <div
                                            key={collection.id}
                                            className={styles["collection-preview"]}
                                            onClick={() => router.push(`/collections/${collection.id}`)}
                                        >
                                            <div className={styles["collection-info"]}>
                                                <h4>{collection.name}</h4>
                                                <p>{collection.description || "No description"}</p>
                                                <span className={styles["item-count"]}>{10} items</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {(!collections || collections.length === 0) && (
                            <div className={styles["empty-state"]}>
                                <div className={styles["empty-icon"]}>📚</div>
                                <h3>No collections yet</h3>
                                <p>Create your first collection to start organizing your items!</p>
                                <button
                                    className={styles["create-button"]}
                                    onClick={() => router.push("/collections")}
                                >
                                    Create First Collection
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ClickSpark>
        </>
    );
};

export default HomePage;
