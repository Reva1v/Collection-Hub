"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CollectionsList } from "@/components/CollectionsList/CollectionsList";
import { Collection } from "@/lib/types/Collection";
import { Item } from "@/lib/types/Item";
import styles from "./RecentCollectionsSection.module.css";

interface EmptyStateProps {
    onCreateCollection: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateCollection }) => (
    <div className={styles["empty-state"]}>
        <p>No collections yet. Create your first collection!</p>
        <button
            onClick={onCreateCollection}
            className={styles["create-button"]}
        >
            Create Collection
        </button>
    </div>
);

interface RecentCollectionsSectionProps {
    collections: Collection[];
    items: Item[];
    maxCollections?: number;
    title?: string;
    className?: string;
}

export const RecentCollectionsSection: React.FC<RecentCollectionsSectionProps> = ({
                                                                                      collections,
                                                                                      items,
                                                                                      maxCollections = 3,
                                                                                      title = "Recent Collections",
                                                                                      className
                                                                                  }) => {
    const router = useRouter();

    const handleCreateCollection = React.useCallback(() => {
        router.push('/collections');
    }, [router]);

    const recentCollections = React.useMemo(() =>
            collections.slice(0, maxCollections),
        [collections, maxCollections]
    );

    return (
        <section className={`${styles["recent-collections"]} ${className || ''}`}>
            <h2>{title}</h2>
            {collections.length > 0 ? (
                <CollectionsList
                    collections={recentCollections}
                    items={items}
                    showHeader={false}
                    className={styles["collections-preview"]}
                />
            ) : (
                <EmptyState onCreateCollection={handleCreateCollection} />
            )}
        </section>
    );
};
