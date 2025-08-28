"use client";

import React, { useMemo, useState } from 'react';
import { useApp } from "@/contexts/AppContext";
import styles from './FilterByType.module.css';

const FilterByType: React.FC = () => {
    const { items, selectedCollection, selectedType, setSelectedType, getUniqueTypes } = useApp();
    const [isAnimating, setIsAnimating] = useState(false);

    const uniqueTypes = getUniqueTypes();

    // Получаем элементы, отфильтрованные только по коллекции (без фильтра по типу)
    const collectionFilteredItems = useMemo(() => {
        if (selectedCollection) {
            return items.filter(item => item.collectionId === selectedCollection.id);
        }
        return items;
    }, [items, selectedCollection]);

    // Вычисляем количество для каждого типа на основе элементов, отфильтрованных только по коллекции
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        collectionFilteredItems.forEach(item => {
            if (item.type) {
                counts[item.type] = (counts[item.type] || 0) + 1;
            }
        });
        return counts;
    }, [collectionFilteredItems]);

    // Общее количество элементов (для кнопки "All") - тоже на основе коллекции
    const totalCount = collectionFilteredItems.length;

    const handleFilterChange = (type: string) => {
        if (type === selectedType) return;

        setIsAnimating(true);
        setSelectedType(type);

        // Убираем индикатор анимации через короткое время
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div className={`${styles.filter} ${isAnimating ? styles.animating : ''}`}>
            <div className={styles.filter__buttons}>
                <button
                    className={`${styles.filter__button} ${selectedType === 'all' ? styles.active : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    All ({totalCount})
                </button>

                {uniqueTypes.map(type => (
                    <button
                        key={type}
                        className={`${styles.filter__button} ${selectedType === type ? styles.active : ''}`}
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
