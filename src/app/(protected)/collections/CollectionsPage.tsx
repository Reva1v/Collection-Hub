"use client";

import * as React from 'react'
import {useRouter} from 'next/navigation'
import styles from './collections.module.css'
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx'
import Dock from "@/components/Dock/Dock.tsx"
import {CreateCollectionForm} from "@/components/CreateCollectionForm/CreateCollectionForm.tsx"
import {CollectionsList} from "@/components/CollectionsList/CollectionsList.tsx"
import {ErrorState} from "@/components/ErrorState/ErrorState.tsx"
import {Loading} from "@/components/Loading/Loading"
import {useCollectionsData} from "@/lib/hooks/useCollectionsData.ts"
import {NAV_ITEMS} from "@/lib/constants/navigation.tsx"

const CollectionsPage: React.FC = () => {
    const router = useRouter()
    const {
        collections,
        items,
        isLoading,
        error,
        refreshCollections,
        refetch
    } = useCollectionsData()

    const navItems = React.useMemo(() =>
            NAV_ITEMS.map(item => ({
                ...item,
                onClick: item.onClick(router)
            })),
        [router]
    )

    // Если ошибка загрузки - показываем fallback
    if (!isLoading && error) {
        return (
            <div className={styles['page']}>
                <div className={styles['main-board']}>
                    <ErrorState
                        title="Unable to load collections"
                        message={error}
                        onRetry={refetch}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <Loading
                isInitialized={!isLoading}
                text="Loading collections..."
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
                        sparkColor='#fff'
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                    >
                        <div className={styles['page']}>
                            <div className={styles['main-board']}>
                                <header className={styles['collections-header']}>
                                    <h1>Your Collections</h1>
                                    <p>Manage and organize your items</p>
                                </header>

                                <CreateCollectionForm onSuccess={refreshCollections} />

                                <section className={styles['collections-section']}>
                                    <CollectionsList
                                        collections={collections}
                                        items={items}
                                        className={styles['collections-list']}
                                    />
                                </section>
                            </div>
                        </div>
                    </ClickSpark>
                </>
            )}
        </>
    )
}

export default CollectionsPage
