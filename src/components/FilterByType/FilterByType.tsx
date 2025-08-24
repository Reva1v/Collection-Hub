import React, { useMemo } from 'react';
import { useEnergetic } from "../../contexts/EnergeticContext";
import styles from './FilterByType.module.css';

const FilterByType: React.FC = () => {
    const { allEnergetics, selectedType, setSelectedType, getUniqueTypes } = useEnergetic();

    const uniqueTypes = getUniqueTypes();

    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allEnergetics.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });
        return counts;
    }, [allEnergetics]);

    return (
        <div className={styles.filter}>
            <div className={styles.filter__buttons}>
                <button
                    className={`${styles.filter__button} ${selectedType === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedType('all')}
                >
                    Все ({allEnergetics.length})
                </button>

                {uniqueTypes.map(type => (
                    <button
                        key={type}
                        className={`${styles.filter__button} ${selectedType === type ? styles.active : ''}`}
                        onClick={() => setSelectedType(type)}
                    >
                        {type} ({typeCounts[type]})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterByType;
