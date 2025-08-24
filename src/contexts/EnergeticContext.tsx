// src/contexts/EnergeticContext.tsx
import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Energetic } from '../types/Energetic';
import energeticsData from '../assets/data/energetics.json';

type CollectStatus = 'unknown' | 'collected' | 'will-not-collect';

interface EnergeticContextType {
    energetics: Energetic[];
    allEnergetics: Energetic[];
    selectedType: string;
    setSelectedType: (type: string) => void;
    getUniqueTypes: () => string[];
    updateCollectStatus: (id: string, status: CollectStatus) => void;
}

const EnergeticContext = createContext<EnergeticContextType | undefined>(undefined);

interface EnergeticProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = 'monster-energetics-collection';

export const EnergeticProvider: React.FC<EnergeticProviderProps> = ({ children }) => {
    const [allEnergetics, setAllEnergetics] = useState<Energetic[]>(() => {
        // Пытаемся загрузить сохраненные данные из localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
                return energeticsData;
            }
        }
        return energeticsData;
    });

    const [selectedType, setSelectedType] = useState<string>('all');

    // Фильтрованные энергетики в зависимости от выбранного типа
    const energetics = useMemo(() => {
        if (selectedType === 'all') {
            return allEnergetics;
        }
        return allEnergetics.filter(energetic => energetic.type === selectedType);
    }, [allEnergetics, selectedType]);

    // Получение уникальных типов
    const getUniqueTypes = () => {
        return [...new Set(allEnergetics.map(energetic => energetic.type))];
    };

    const updateCollectStatus = (id: string, status: CollectStatus) => {
        const updatedEnergetics = allEnergetics.map(energetic =>
            energetic.id === id
                ? { ...energetic, collect: status }
                : energetic
        );

        setAllEnergetics(updatedEnergetics);

        // Сохраняем изменения в localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEnergetics));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    return (
        <EnergeticContext.Provider value={{
            energetics,
            allEnergetics,
            selectedType,
            setSelectedType,
            getUniqueTypes,
            updateCollectStatus
        }}>
            {children}
        </EnergeticContext.Provider>
    );
};

export const useEnergetic = () => {
    const context = useContext(EnergeticContext);
    if (context === undefined) {
        throw new Error('useEnergetic must be used within an EnergeticProvider');
    }
    return context;
};
