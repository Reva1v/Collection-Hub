"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from "react";
import type { Energetic } from "@/types/Energetic";

type CollectStatus = "unknown" | "collected" | "will-not-collect";

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

const STORAGE_KEY = "monster-energetics-collection";

export const EnergeticProvider: React.FC<EnergeticProviderProps> = ({ children }) => {
    const [allEnergetics, setAllEnergetics] = useState<Energetic[]>([]);
    const [selectedType, setSelectedType] = useState<string>("all");

    // Загружаем данные из API при монтировании
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/energetics");
                const data: Energetic[] = await res.json();

                // Если есть сохранённые данные в localStorage → объединяем с БД
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData) as Energetic[];
                    // Обновляем только поле "collect", остальное берём из БД
                    const merged = data.map((dbItem) => {
                        const saved = parsed.find((s) => s.id === dbItem.id);
                        return saved ? { ...dbItem, collect: saved.collect } : dbItem;
                    });
                    setAllEnergetics(merged);
                } else {
                    setAllEnergetics(data);
                }
            } catch (e) {
                console.error("Failed to fetch energetics:", e);
            }
        }

        loadData();
    }, []);

    const energetics = useMemo(() => {
        if (selectedType === "all") return allEnergetics;
        return allEnergetics.filter((energetic) => energetic.type === selectedType);
    }, [allEnergetics, selectedType]);

    const getUniqueTypes = () => [...new Set(allEnergetics.map((e) => e.type))];

    const updateCollectStatus = (id: string, status: CollectStatus) => {
        setAllEnergetics((prev) => {
            const updated = prev.map((energetic) =>
                energetic.id === id ? { ...energetic, collect: status } : energetic
            );

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
                console.error("Error saving to localStorage:", error);
            }

            return updated;
        });
    };

    return (
        <EnergeticContext.Provider
            value={{
                energetics,
                allEnergetics,
                selectedType,
                setSelectedType,
                getUniqueTypes,
                updateCollectStatus,
            }}
        >
            {children}
        </EnergeticContext.Provider>
    );
};

export const useEnergetic = () => {
    const context = useContext(EnergeticContext);
    if (context === undefined) {
        throw new Error("useEnergetic must be used within an EnergeticProvider");
    }
    return context;
};
