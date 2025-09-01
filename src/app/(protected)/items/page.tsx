"use client";

import * as React from 'react';
import styles from '@/app/(protected)/items/items.module.css';
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx';
import CardList from "@/components/CardList/CardList.tsx";
import Header from "@/components/Header/Header.tsx";
import {useApp} from "@/contexts/AppContext.tsx";
import {VscAccount, VscArchive, VscHome} from "react-icons/vsc";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Dock from "@/components/Dock/Dock.tsx";
import {useRouter} from "next/navigation";

const ItemsPage: React.FC<{ collectionId?: string }> = ({collectionId}) => {
    const {
        collections,
        setSelectedCollection,
        isLoading,
        error,
    } = useApp();

    const router = useRouter();

    // Устанавливаем выбранную коллекцию при монтировании, если передан collectionId
    React.useEffect(() => {
        if (collectionId && collections.length > 0) {
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                setSelectedCollection(collection);
            }
        }
    }, [collectionId, collections, setSelectedCollection]);

    // Показываем ошибку на уровне приложения
    if (error && isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    Error loading application: {error}
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
                    <Header/>
                    <div className={styles['home']}>
                        <div className={styles['main-board']}>
                            <CardList/>
                        </div>
                    </div>
                </div>
            </ClickSpark>
        </>
    );
};


export default ItemsPage;
