"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/ItemsPage/items.module.css';
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx';
import CardList from "@/components/CardList/CardList.tsx";
import Header from "@/components/Header/Header.tsx";
import { VscAccount, VscArchive, VscHome } from "react-icons/vsc";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Dock from "@/components/Dock/Dock.tsx";
import {Item} from "@/lib/types/Item.ts";
import {Collection} from "@/lib/types/Collection.ts";


interface ItemsPageProps {
    collections: Collection[];
    items: Item[];
    selectedCollectionId?: string;
    uniqueTypes: string[];
}

const ItemsPage: React.FC<ItemsPageProps> = ({
                                                 collections,
                                                 items,
                                                 selectedCollectionId,
                                                 uniqueTypes
                                             }) => {
    const router = useRouter();

    // Локальное состояние для фильтрации
    const [selectedCollection, setSelectedCollection] = React.useState<Collection | null>(null);
    const [selectedType, setSelectedType] = React.useState<string>("all");

    // Устанавливаем выбранную коллекцию при монтировании
    React.useEffect(() => {
        if (selectedCollectionId && collections.length > 0) {
            const collection = collections.find(c => c.id === selectedCollectionId);
            if (collection) {
                setSelectedCollection(collection);
            }
        }
    }, [selectedCollectionId, collections]);

    // Фильтруем элементы
    const filteredItems = React.useMemo(() => {
        let filtered = items;

        // Фильтруем по выбранной коллекции
        if (selectedCollection) {
            filtered = filtered.filter(item => item.collectionId === selectedCollection.id);
        }

        // Фильтруем по типу
        if (selectedType !== "all") {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        return filtered;
    }, [items, selectedCollection, selectedType]);

    const dockItems = [
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
                items={dockItems.map(item => ({
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
                    <Header
                        collections={collections}
                        selectedCollection={selectedCollection}
                        setSelectedCollection={setSelectedCollection}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        uniqueTypes={uniqueTypes}
                        filteredItems={filteredItems}
                    />
                    <div className={styles['home']}>
                        <div className={styles['main-board']}>
                            <CardList
                                items={filteredItems}
                                selectedCollection={selectedCollection}
                            />
                        </div>
                    </div>
                </div>
            </ClickSpark>
        </>
    );
};

export default ItemsPage;
