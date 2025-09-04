"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/ItemsPage/items.module.css';
import ClickSpark from '@/components/ClickSpark/ClickSpark.tsx';
import CardList from "@/components/CardList/CardList.tsx";
import Header from "@/components/Header/Header.tsx";
import Dock from "@/components/Dock/Dock.tsx";
import {Item} from "@/lib/types/Item.ts";
import {Collection} from "@/lib/types/Collection.ts";
import {NAV_ITEMS} from "@/lib/constants/navigation";


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


    return (
        <>
            <Dock
                items={NAV_ITEMS.map(item => ({
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
