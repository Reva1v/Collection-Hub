import * as React from 'react'
import {CollectionCard} from '@/components/CollectionCard/CollectionCard.tsx'
import {Collection} from '@/lib/types/Collection.ts'
import {Item} from '@/lib/types/Item.ts'
import styles from './CollectionsList.module.css'

interface Props {
    collections: Collection[]
    items: Item[]
    showHeader?: boolean
    className?: string
}

export const CollectionsList: React.FC<Props> = ({
                                                     collections,
                                                     items,
                                                     showHeader = true,
                                                     className
                                                 }) => {
    if (collections.length === 0) {
        return (
            <div className={`${styles['empty-state']} ${className || ''}`}>
                <div className={styles['empty-icon']}>📚</div>
                <h3>No collections yet</h3>
                <p>Create your first collection to start organizing your items!</p>
            </div>
        )
    }

    return (
        <div className={className}>
            {showHeader && (
                <h2 className={styles['section-title']}>
                    Your Collections ({collections.length})
                </h2>
            )}
            <div className={styles['collections-grid']}>
                {collections.map(collection => (
                    <CollectionCard
                        key={collection.id}
                        collection={collection}
                        items={items}
                    />
                ))}
            </div>
        </div>
    )
}
