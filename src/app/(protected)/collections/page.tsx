"use client";

import * as React from 'react'
import {useRouter} from 'next/navigation'
import styles from './collections.module.css'
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx';
import {useApp} from "@/contexts/AppContext.tsx";
import {VscAccount, VscArchive, VscHome} from "react-icons/vsc";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Dock from "@/components/Dock/Dock.tsx";
import {CollectionCard} from "@/components/CollectionCard/CollectionCard.tsx";


// Основная страница коллекций
const CollectionsPage: React.FC = () => {
    const {
        collections,
        error,
        createCollection
    } = useApp();

    const router = useRouter();

    const [isCreating, setIsCreating] = React.useState(false);
    const [newCollectionName, setNewCollectionName] = React.useState('');
    const [newCollectionDescription, setNewCollectionDescription] = React.useState('');

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        setIsCreating(true);
        try {
            const result = await createCollection(
                newCollectionName.trim(),
                newCollectionDescription.trim() || undefined
            );

            if (result) {
                setNewCollectionName('');
                setNewCollectionDescription('');
            }
        } catch (error) {
            console.error('Failed to create collection:', error);
        } finally {
            setIsCreating(false);
        }
    };

    // Состояние ошибки
    if (error) {
        return (
            <div className={styles['page']}>
                <div className={styles['error-state']}>
                    <h2>Error loading collections</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
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
    ];

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
                            <form onSubmit={handleCreateCollection} className={styles['create-form']}>
                                <div className={styles['form-group']}>
                                    <input
                                        type="text"
                                        placeholder="Collection name"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        disabled={isCreating}
                                        required
                                    />
                                </div>
                                <div className={styles['form-group']}>
                                <textarea
                                    placeholder="Description (optional)"
                                    value={newCollectionDescription}
                                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                                    disabled={isCreating}
                                    rows={3}
                                />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isCreating || !newCollectionName.trim()}
                                    className={styles['create-button']}
                                >
                                    {isCreating ? 'Creating...' : 'Create Collection'}
                                </button>
                            </form>
                        </div>

                        {/* Список коллекций */}
                        <div className={styles['collections-section']}>
                            <h2>Your Collections ({collections.length})</h2>

                            {collections.length > 0 ? (
                                <div className={styles['collections-grid']}>
                                    {collections.map(collection => (
                                        <CollectionCard
                                            key={collection.id}
                                            collection={collection}
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
    );
};

export default CollectionsPage;
