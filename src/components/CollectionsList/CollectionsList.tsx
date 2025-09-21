// components/CollectionsList/CollectionsList.tsx
import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CollectionCard } from '@/components/Collection/CollectionCard/CollectionCard.tsx'
import { deleteCollection } from '@/lib/collections/actions'
import { Collection } from '@/lib/types/Collection.ts'
import { Item } from '@/lib/types/Item.ts'
import styles from './CollectionsList.module.css'

interface Props {
    collections: Collection[]
    items: Item[]
    showHeader?: boolean
    className?: string
    onCollectionsChange?: () => void // Callback для обновления списка
}

export const CollectionsList: React.FC<Props> = ({
                                                     collections,
                                                     items,
                                                     showHeader = true,
                                                     className,
                                                     onCollectionsChange
                                                 }) => {
    const [deletingCollections, setDeletingCollections] = useState<Set<string>>(new Set())
    const router = useRouter()

    const handleEdit = (collection: Collection) => {
        // Перенаправляем на страницу редактирования
        router.push(`/collections/${collection.id}/edit`)
    }

    const handleDelete = async (collectionId: string) => {
        if (deletingCollections.has(collectionId)) return

        setDeletingCollections(prev => new Set(prev).add(collectionId))

        try {
            await deleteCollection(collectionId)
            // После успешного удаления обновляем список
            if (onCollectionsChange) {
                onCollectionsChange()
            }
        } catch (error) {
            console.error('Failed to delete collection:', error)
            // Можно добавить toast уведомление об ошибке
        } finally {
            setDeletingCollections(prev => {
                const next = new Set(prev)
                next.delete(collectionId)
                return next
            })
        }
    }

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
                        onEdit={() => handleEdit(collection)}
                        onDelete={() => handleDelete(collection.id)}
                        isDeleting={deletingCollections.has(collection.id)}
                    />
                ))}
            </div>
        </div>
    )
}
