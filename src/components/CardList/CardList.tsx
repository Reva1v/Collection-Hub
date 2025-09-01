"use client";

import React, {useState, useEffect, useRef} from "react";
import Card from "@/components/Card/Card";
import styles from "./CardList.module.css";
import {Item} from "@/lib/types/Item";
import {Collection} from "@/lib/types/Collection";

interface CardListProps {
    items: Item[];
    selectedCollection: Collection | null;
    isLoading?: boolean;
    error?: string | null;
}

const CardList: React.FC<CardListProps> = ({items, selectedCollection, isLoading = false, error = null}) => {
    const [animatedCards, setAnimatedCards] = useState<string[]>([]);
    const previousItemsRef = useRef<string[]>([]);

    // Анимация при изменении состава
    useEffect(() => {
        const currentIds = items.map((item) => item.id);
        const previousIds = previousItemsRef.current;

        const hasCompositionChanged =
            currentIds.length !== previousIds.length ||
            currentIds.some((id, index) => id !== previousIds[index]);

        if (hasCompositionChanged) {
            setAnimatedCards([]);

            items.forEach((item, index) => {
                setTimeout(() => {
                    setAnimatedCards((prev) => [...prev, item.id]);
                }, index * 50);
            });

            previousItemsRef.current = currentIds;
        }
    }, [items]);

    // Инициализация при первой загрузке
    useEffect(() => {
        if (previousItemsRef.current.length === 0 && items.length > 0) {
            const initialIds = items.map((item) => item.id);
            previousItemsRef.current = initialIds;

            items.forEach((item, index) => {
                setTimeout(() => {
                    setAnimatedCards((prev) => [...prev, item.id]);
                }, index * 50);
            });
        }
    }, [items]);

    // Сброс при смене коллекции
    useEffect(() => {
        setAnimatedCards([]);
        previousItemsRef.current = [];

        if (items.length > 0) {
            setTimeout(() => {
                items.forEach((item, index) => {
                    setTimeout(() => {
                        setAnimatedCards((prev) => [...prev, item.id]);
                    }, index * 50);
                });
                previousItemsRef.current = items.map((item) => item.id);
            }, 100);
        }
    }, [selectedCollection?.id]);

    // Ошибка
    if (error) {
        return (
            <div className={styles["error-state"]}>
                <div className={styles["error-icon"]}>⚠️</div>
                <h3>An error occurred</h3>
                <p>{error}</p>
                <button
                    className={styles["retry-button"]}
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </div>
        );
    }

    // Загрузка
    if (isLoading) {
        return (
            <div className={styles["loading-state"]}>
                <div className={styles["loading-spinner"]}/>
                <p>Loading elements...</p>
            </div>
        );
    }

    // Пусто
    if (items.length === 0) {
        return (
            <div className={styles["empty-state"]}>
                <div className={styles["empty-icon"]}>📭</div>
                <h3>
                    {selectedCollection
                        ? `The collection "${selectedCollection.name}" has no items yet`
                        : "You don't have any ItemsPage yet"}
                </h3>
                <p>Add the first item to this collection</p>
                {selectedCollection && (
                    <button className={styles["add-item-btn"]}>
                        <span className={styles["btn-icon"]}>+</span>
                        Add First Item
                    </button>
                )}
            </div>
        );
    }

    return (
        <ul className={styles["card-list"]} role="list">
            {items.map((item, index) => (
                <li
                    key={item.id ?? `item-${index}`}
                    className={`${styles["card-item"]} ${
                        animatedCards.includes(item.id)
                            ? styles["card-item--visible"]
                            : styles["card-item--hidden"]
                    }`}
                    role="listitem"
                >
                    <Card item={item}/>
                </li>
            ))}
        </ul>
    );
};

export default CardList;
