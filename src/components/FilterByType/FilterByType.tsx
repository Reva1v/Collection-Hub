"use client";

import React, {useEffect, useMemo, useState} from "react";
import styles from "./FilterByType.module.css";
import { Item } from "@/lib/types/Item";
import { Collection } from "@/lib/types/Collection";

interface FilterByTypeProps {
    items: Item[];
    selectedCollection: Collection | null;
    selectedType: string;
    setSelectedType: (type: string) => void;
    uniqueTypes: string[];
}

const FilterByType: React.FC<FilterByTypeProps> = ({
                                                       items,
                                                       selectedCollection,
                                                       selectedType,
                                                       setSelectedType,
                                                       uniqueTypes,
                                                   }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // Элементы только для текущей коллекции
    const collectionFilteredItems = useMemo(() => {
        if (selectedCollection) {
            return items.filter(
                (item) => item.collectionId === selectedCollection.id
            );
        }
        return items;
    }, [items, selectedCollection]);

    // Подсчёт количества для каждого типа
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        collectionFilteredItems.forEach((item) => {
            if (item.type) {
                counts[item.type] = (counts[item.type] || 0) + 1;
            }
        });
        return counts;
    }, [collectionFilteredItems]);

    // Общее количество для кнопки "All"
    const totalCount = collectionFilteredItems.length;

    const handleFilterChange = (type: string) => {
        if (type === selectedType) return;

        setIsAnimating(true);
        setSelectedType(type);

        setTimeout(() => setIsAnimating(false), 300);
    };

    useEffect(() => {
        console.log("items:", items);
        console.log("collectionFilteredItems:", collectionFilteredItems);
        console.log("typeCounts:", typeCounts);
        console.log("uniqueTypes:", uniqueTypes);
    }, [items, collectionFilteredItems, typeCounts, uniqueTypes]);

    return (
        <div
            className={`${styles.filter} ${
                isAnimating ? styles.animating : ""
            }`}
        >
            <div className={styles.filter__buttons}>
                <button
                    className={`${styles.filter__button} ${
                        selectedType === "all" ? styles.active : ""
                    }`}
                    onClick={() => handleFilterChange("all")}
                >
                    All ({totalCount})
                </button>

                {uniqueTypes.map((type) => (
                    <button
                        key={type}
                        className={`${styles.filter__button} ${
                            selectedType === type ? styles.active : ""
                        }`}
                        onClick={() => handleFilterChange(type)}
                    >
                        {type} ({typeCounts[type] || 0})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterByType;
