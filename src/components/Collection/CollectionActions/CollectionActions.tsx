// components/CollectionActions/CollectionActions.tsx
import * as React from 'react'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import styles from './CollectionActions.module.css'

interface CollectionActionsProps {
    collectionId: string
    collectionName: string
    onEdit?: () => void
    onDelete?: () => Promise<void>
    variant?: 'dropdown' | 'buttons' | 'floating'
    showLabels?: boolean
}

export const CollectionActions: React.FC<CollectionActionsProps> = ({
                                                                        collectionId,
                                                                        collectionName,
                                                                        onEdit,
                                                                        onDelete,
                                                                        variant = 'dropdown',
                                                                        showLabels = false
                                                                    }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const router = useRouter()

    const handleEdit = () => {
        setIsOpen(false)
        if (onEdit) {
            onEdit()
        } else {
            // Перенаправляем на страницу редактирования
            router.push(`/collections/${collectionId}/edit`)
        }
    }

    const handleDelete = () => {
        setShowDeleteConfirm(true)
        setIsOpen(false)
    }

    const confirmDelete = () => {
        if (onDelete) {
            onDelete()
        }
        setShowDeleteConfirm(false)
    }

    if (variant === 'dropdown') {
        return (
            <div className={styles['dropdown-container']}>
                <button
                    className={styles['dropdown-trigger']}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Collection actions"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className={styles['dropdown-backdrop']}
                            onClick={() => setIsOpen(false)}
                        />
                        <div className={styles['dropdown-menu']}>
                            <button
                                className={styles['dropdown-item']}
                                onClick={handleEdit}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Edit Collection
                            </button>
                            <button
                                className={`${styles['dropdown-item']} ${styles['delete']}`}
                                onClick={handleDelete}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Delete Collection
                            </button>
                        </div>
                    </>
                )}

                {showDeleteConfirm && (
                    <div className={styles['modal-backdrop']}>
                        <div className={styles['confirm-modal']}>
                            <h3>Delete Collection</h3>
                            <p>Are you sure you want to delete `{collectionName}`?</p>
                            <p className={styles['warning']}>This action cannot be undone.</p>

                            <div className={styles['modal-actions']}>
                                <button
                                    className={styles['cancel-btn']}
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles['delete-btn']}
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (variant === 'buttons') {
        return (
            <div className={styles['buttons-container']}>
                <button
                    className={styles['action-btn']}
                    onClick={handleEdit}
                    title="Edit collection"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    {showLabels && <span>Edit</span>}
                </button>
                <button
                    className={`${styles['action-btn']} ${styles['delete']}`}
                    onClick={handleDelete}
                    title="Delete collection"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    {showLabels && <span>Delete</span>}
                </button>

                {showDeleteConfirm && (
                    <div className={styles['modal-backdrop']}>
                        <div className={styles['confirm-modal']}>
                            <h3>Delete Collection</h3>
                            <p>Are you sure you want to delete `{collectionName}`?</p>
                            <p className={styles['warning']}>This action cannot be undone.</p>

                            <div className={styles['modal-actions']}>
                                <button
                                    className={styles['cancel-btn']}
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles['delete-btn']}
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // variant === 'floating'
    return (
        <div className={styles['floating-container']}>
            <div className={styles['floating-actions']}>
                <button
                    className={styles['floating-btn']}
                    onClick={handleEdit}
                    title="Edit collection"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button
                    className={`${styles['floating-btn']} ${styles['delete']}`}
                    onClick={handleDelete}
                    title="Delete collection"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>

            {showDeleteConfirm && (
                <div className={styles['modal-backdrop']}>
                    <div className={styles['confirm-modal']}>
                        <h3>Delete Collection</h3>
                        <p>Are you sure you want to delete `{collectionName}`?</p>
                        <p className={styles['warning']}>This action cannot be undone.</p>

                        <div className={styles['modal-actions']}>
                            <button
                                className={styles['cancel-btn']}
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles['delete-btn']}
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

