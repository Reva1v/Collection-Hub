"use client";

import styles from "./Header.module.css";
import type {FC} from "react";
import FilterByType from "../FilterByType/FilterByType";
import {Collection} from "@/lib/types/Collection";
import {Item} from "@/lib/types/Item";
import {CollectionWithItems} from "@/lib/types/Collection.ts";

interface HeaderProps {
    showNav?: boolean;
    collections: Collection[];
    selectedCollection: Collection | null;
    setSelectedCollection: (collection: Collection | null) => void;
    selectedType: string;
    setSelectedType: (type: string) => void;
    uniqueTypes: string[];
    filteredItems: Item[];
}

const Header: FC<HeaderProps> = ({
                                     showNav = false,
                                     collections,
                                     selectedCollection,
                                     setSelectedCollection,
                                     selectedType,
                                     setSelectedType,
                                     uniqueTypes,
                                     filteredItems,
                                 }) => {
    // Считаем собранные элементы
    const collectedCount = filteredItems.filter(
        (item) => item.collectStatus === "collected"
    ).length;
    const totalCount = filteredItems.length;

    // Текст для отображения
    const contextText = selectedCollection
        ? `In "${selectedCollection.name}":`
        : "Collected:";

    return (
        <header className={styles.header}>
            <div className={styles.header__inner}>
                <p>
                    {contextText} {collectedCount} of {totalCount}
                </p>
                <FilterByType
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    uniqueTypes={uniqueTypes}
                    items={selectedCollection ? (selectedCollection as CollectionWithItems).items : []}
                    selectedCollection={selectedCollection}/>
            </div>
        </header>
    );
};

export default Header;
