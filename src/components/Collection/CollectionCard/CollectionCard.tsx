"use client";

import * as React from 'react'
import {useRouter} from 'next/navigation'
import type {Collection} from "@/lib/types/Collection.ts";
import type {Item} from "@/lib/types/Item.ts";
import styles from "./CollectionCard.module.css";
import {CollectionActions} from "@/components/Collection/CollectionActions/CollectionActions.tsx";

interface CollectionCardProps {
    collection: Collection;
    items: Item[];
    onEdit?: (collection: Collection) => void
    onDelete?: (collectionId: string) => void
    isDeleting?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
                                                                  collection,
                                                                  items = [],
                                                                  onEdit,
                                                                  onDelete,
                                                                  isDeleting = false,
                                                              }) => {
    const router = useRouter();

    const itemsCount = items.filter(item => item.collectionId === collection.id).length;

    const collectedCount = items.filter(
        item =>
            item.collectionId === collection.id &&
            (item.collectStatus === 'collected' || item.collectStatus === 'will-not-collect')
    ).length;

    const handleClick = () => {
        router.push(`/collections/${collection.id}`);
    };

    const handleEdit = async () => {
        if (onEdit) {
            await onEdit(collection);
        }
    }

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(collection.id);
        }
    }

    return (
        <div className={styles['collection-card']}>
            <div
                className={styles['card-content']}
                onClick={handleClick}
            >
                {/* Collection Info */}
                <div className={styles['collection-info']}>
                    <h3 className={styles['collection-name']}>{collection.name}</h3>
                    {collection.description && (
                        <p className={styles['collection-description']}>
                            {collection.description}
                        </p>
                    )}
                    <div className={styles['collection-stats']}>
                        <span className={styles['items-count']}>
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </span>
                        <span className={styles['collected-count']}>
            {collectedCount} collected
                        </span>
                    </div>
                </div>


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

                <span className={styles['created-date']}>
                            Created {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : 'N/A'}
                </span>
            </div>

            <div className={styles['card-actions']}>
                <CollectionActions
                    collectionId={collection.id}
                    collectionName={collection.name}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    variant="dropdown"
                />
            </div>
        </div>
    );
};
