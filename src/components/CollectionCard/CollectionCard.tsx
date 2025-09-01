"use client";

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { Collection } from "@/lib/types/Collection.ts";
import type { Item } from "@/lib/types/Item.ts";
import styles from "./CollectionCard.module.css";

interface CollectionCardProps {
    collection: Collection;
    items: Item[]; // Передаем ItemsPage как prop вместо получения из контекста
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, items = [] }) => {
    const router = useRouter();

    // Считаем количество элементов в коллекции
    const itemsCount = items.filter(item => item.collectionId === collection.id).length;

    // Считаем собранные элементы
    const collectedCount = items.filter(
        item =>
            item.collectionId === collection.id &&
            (item.collectStatus === 'collected' || item.collectStatus === 'will-not-collect')
    ).length;

    const handleClick = () => {
        // Переходим на страницу конкретной коллекции
        router.push(`/collections/${collection.id}`);
        // router.push(`/ItemsPage`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className={styles['collection-card']}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className={styles['collection-header']}>
                <h3 className={styles['collection-name']}>{collection.name}</h3>
                <div className={styles['collection-stats']}>
                    <span className={styles['ItemsPage-count']}>{itemsCount} items</span>
                    <span className={styles['collected-count']}>
            {collectedCount} collected
          </span>
                </div>
            </div>

            {collection.description && (
                <p className={styles['collection-description']}>
                    {collection.description}
                </p>
            )}

            <div className={styles['collection-footer']}>
                <div className={styles['progress-bar']}>
                    <div
                        className={styles['progress-fill']}
                        style={{
                            width: itemsCount > 0 ? `${(collectedCount / itemsCount) * 100}%` : '0%'
                        }}
                    />
                </div>
                <span className={styles['progress-text']}>
          {itemsCount > 0 ? Math.round((collectedCount / itemsCount) * 100) : 0}% complete
        </span>
            </div>

            <div className={styles['collection-date']}>
                {/*Created: {new Date(collection.createdAt).toLocaleDateString()}*/}
            </div>
        </div>
    );
};
