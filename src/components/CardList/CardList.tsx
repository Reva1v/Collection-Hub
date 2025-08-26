"use client";

import React, {useState, useEffect, useRef} from 'react';
import Card from '@/components/Card/Card';
import styles from './CardList.module.css';
import {useEnergetic} from "@/contexts/EnergeticContext";

const CardList: React.FC = () => {
    const {energetics} = useEnergetic();
    const [animatedCards, setAnimatedCards] = useState<string[]>([]);
    const previousEnergeticsRef = useRef<string[]>([]);

    useEffect(() => {
        const currentIds = energetics.map(e => e.id);
        const previousIds = previousEnergeticsRef.current;

        // Проверяем, изменился ли состав карточек (а не только их данные)
        const hasCompositionChanged =
            currentIds.length !== previousIds.length ||
            currentIds.some((id, index) => id !== previousIds[index]);

        if (hasCompositionChanged) {
            // Только если изменился состав карточек - перезапускаем анимацию
            setAnimatedCards([]);

            energetics.forEach((energetic, index) => {
                setTimeout(() => {
                    setAnimatedCards(prev => [...prev, energetic.id]);
                }, index * 50);
            });

            // Обновляем референс
            previousEnergeticsRef.current = currentIds;
        }
    }, [energetics]);

    // Инициализация при первой загрузке
    useEffect(() => {
        if (previousEnergeticsRef.current.length === 0) {
            const initialIds = energetics.map(e => e.id);
            previousEnergeticsRef.current = initialIds;

            energetics.forEach((energetic, index) => {
                setTimeout(() => {
                    setAnimatedCards(prev => [...prev, energetic.id]);
                }, index * 50);
            });
        }
    }, []);

    return (
        <ul className={styles['card-list']}>
            {energetics.map((energetic) => (
                <div key={energetic.id} className={`${styles['card-item']} ${
                    animatedCards.includes(energetic.id) ? styles['card-item--visible'] : styles['card-item--hidden']
                }`}
                >
                    <Card energetic={energetic}/>
                </div>
            ))}
        </ul>
    );
};

export default CardList;
