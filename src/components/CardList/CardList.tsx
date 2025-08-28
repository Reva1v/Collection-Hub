"use client";

import React, {useState, useEffect, useRef} from 'react';
import Card from '@/components/Card/Card';
import styles from './CardList.module.css';
import {useApp} from "@/contexts/AppContext";

const CardList: React.FC = () => {
    const {filteredItems, isLoading, error, selectedCollection} = useApp();
    const [animatedCards, setAnimatedCards] = useState<string[]>([]);
    const previousItemsRef = useRef<string[]>([]);

    useEffect(() => {
        const currentIds = filteredItems.map(item => item.id);
        const previousIds = previousItemsRef.current;

        // Проверяем, изменился ли состав карточек (а не только их данные)
        const hasCompositionChanged =
            currentIds.length !== previousIds.length ||
            currentIds.some((id, index) => id !== previousIds[index]);

        if (hasCompositionChanged) {
            // Только если изменился состав карточек - перезапускаем анимацию
            setAnimatedCards([]);

            filteredItems.forEach((item, index) => {
                setTimeout(() => {
                    setAnimatedCards(prev => [...prev, item.id]);
                }, index * 50);
            });

            // Обновляем референс
            previousItemsRef.current = currentIds;
        }
    }, [filteredItems]);

    // Инициализация при первой загрузке
    useEffect(() => {
        if (previousItemsRef.current.length === 0) {
            const initialIds = filteredItems.map(item => item.id);
            previousItemsRef.current = initialIds;

            filteredItems.forEach((item, index) => {
                setTimeout(() => {
                    setAnimatedCards(prev => [...prev, item.id]);
                }, index * 50);
            });
        }
    }, []);

    // Сброс анимации при смене коллекции
    useEffect(() => {
        setAnimatedCards([]);
        previousItemsRef.current = [];

        // Запускаем анимацию с задержкой для новой коллекции
        setTimeout(() => {
            filteredItems.forEach((item, index) => {
                setTimeout(() => {
                    setAnimatedCards(prev => [...prev, item.id]);
                }, index * 50);
            });
            previousItemsRef.current = filteredItems.map(item => item.id);
        }, 100);
    }, [selectedCollection?.id]);

    // Состояние ошибки
    if (error) {
        return (
            <div className={styles['error-state']}>
                <div className={styles['error-icon']}>⚠️</div>
                <h3>An error occurred</h3>
                <p>{error}</p>
                <button
                    className={styles['retry-button']}
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </div>
        );
    }

    // Состояние загрузки
    if (isLoading) {
        return (
            <div className={styles['loading-state']}>
                <div className={styles['loading-spinner']}/>
                <p>Loading elements...</p>
            </div>
        );
    }

    // Пустое состояние - нет элементов
    if (filteredItems.length === 0) {
        return (
            <div className={styles['empty-state']}>
                <div className={styles['empty-icon']}>📭</div>
                <h3>
                    {selectedCollection
                        ? `The collection "${selectedCollection.name}" has no items yet`
                        : "You don't have any items yet"
                    }
                </h3>
                <p>Add the first item to this collection</p>
                {selectedCollection && (
                    <button
                        className={styles['add-item-btn']}
                        // onClick={createItem}
                    >
                        <span className={styles['btn-icon']}>+</span>
                        Add First Item
                    </button>
                )}
            </div>
        );
    }


    return (
        <>
            {/* Список карточек */}
            <ul className={styles['card-list']} role="list">
                {filteredItems.map((item, index) => (
                    <li
                        key={item.id ?? `item-${index}`}
                        className={`${styles['card-item']} ${
                            animatedCards.includes(item.id)
                                ? styles['card-item--visible']
                                : styles['card-item--hidden']
                        }`}
                        role="listitem"
                    >
                        <Card item={item}/>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CardList;
