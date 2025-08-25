"use client";

import React, { useMemo, useState } from 'react';
import { useEnergetic } from "@/contexts/EnergeticContext";
import styles from './FilterByType.module.css';

const FilterByType: React.FC = () => {
    const { allEnergetics, selectedType, setSelectedType, getUniqueTypes } = useEnergetic();
    const [isAnimating, setIsAnimating] = useState(false);

    const uniqueTypes = getUniqueTypes();

    // Вычисляем количество для каждого типа только один раз
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allEnergetics.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });
        return counts;
    }, [allEnergetics]);

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
                    All ({allEnergetics.length})
                </button>

                {uniqueTypes.map(type => (
                    <button
                        key={type}
                        className={`${styles.filter__button} ${selectedType === type ? styles.active : ''}`}
                        onClick={() => handleFilterChange(type)}
                    >
                        {type} ({typeCounts[type]})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterByType;
