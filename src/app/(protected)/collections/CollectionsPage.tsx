"use client";

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import styles from './collections.module.css'
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx'
import { VscAccount, VscArchive, VscHome } from "react-icons/vsc"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import Dock from "@/components/Dock/Dock.tsx"
import { CollectionCard } from "@/components/CollectionCard/CollectionCard.tsx"
import { createCollection } from '@/lib/collections/actions.ts'
import { Collection } from '@/lib/types/Collection.ts'
import { Item } from '@/lib/types/Item.ts'

interface CollectionsPageProps {
    initialCollections: Collection[]
    initialItems: Item[] // Добавляем items для подсчета статистики
}

// Основная страница коллекций
const CollectionsPage: React.FC<CollectionsPageProps> = ({ initialCollections, initialItems }) => {
    const router = useRouter()
    const [state, formAction] = useFormState(createCollection, null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Локальное состояние для формы
    const formRef = React.useRef<HTMLFormElement>(null)

    // Обрабатываем успешное создание
    React.useEffect(() => {
        if (state?.success) {
            formRef.current?.reset()
            setIsSubmitting(false)
        } else if (state?.error) {
            setIsSubmitting(false)
        }
    }, [state])

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        formAction(formData)
    }

    const items = [
        {
            icon: <VscHome size={18}/>,
            label: 'Home',
            href: '/',
            onClick: (router: AppRouterInstance) => () => router.push('/')
        },
        {
            icon: <VscArchive size={18}/>,
            label: 'Collections',
            href: '/collections',
            onClick: (router: AppRouterInstance) => () => router.push('/collections')
        },
        {
            icon: <VscAccount size={18}/>,
            label: 'Profile',
            href: '/profile',
            onClick: (router: AppRouterInstance) => () => router.push('/profile')
        },
    ]

    return (
        <>
            <Dock
                items={items.map(item => ({
                    ...item,
                    onClick: item.onClick(router)
                }))}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />
            <ClickSpark
                sparkColor='#fff'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
            >
                <div className={styles['page']}>
                    <div className={styles['main-board']}>
                        <div className={styles['collections-header']}>
                            <h1>Your Collections</h1>
                            <p>Manage and organize your items</p>
                        </div>

                        {/* Форма создания новой коллекции */}
                        <div className={styles['create-collection']}>
                            <h2>Create New Collection</h2>
                            <form ref={formRef} action={handleSubmit} className={styles['create-form']}>
                                <div className={styles['form-group']}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Collection name"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <div className={styles['form-group']}>
                  <textarea
                      name="description"
                      placeholder="Description (optional)"
                      disabled={isSubmitting}
                      rows={3}
                  />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={styles['create-button']}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Collection'}
                                </button>

                                {/* Показываем ошибки */}
                                {state?.error && (
                                    <div className={styles['error-message']}>
                                        {state.error}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Список коллекций */}
                        <div className={styles['collections-section']}>
                            <h2>Your Collections ({initialCollections.length})</h2>

                            {initialCollections.length > 0 ? (
                                <div className={styles['collections-grid']}>
                                    {initialCollections.map(collection => (
                                        <CollectionCard
                                            key={collection.id}
                                            collection={collection}
                                            items={initialItems}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles['empty-state']}>
                                    <div className={styles['empty-icon']}>📚</div>
                                    <h3>No collections yet</h3>
                                    <p>Create your first collection to start organizing your items!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ClickSpark>
        </>
    )
}

export default CollectionsPage
