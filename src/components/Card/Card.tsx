"use client";

import type { Item, CollectStatus } from "@/contexts/AppContext";
import styles from './Card.module.css';
import * as React from "react";
import { useState } from "react";
import CheckCardPopup from "@/components/CheckCardPopup/CheckCardPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useApp } from "@/contexts/AppContext";
import { createPortal } from "react-dom";

interface CardProps {
    item: Item;
}

const Card: React.FC<CardProps> = ({ item }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { updateCollectStatus } = useApp();

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleStatusChange = async (status: CollectStatus) => {
        setIsUpdating(true);
        try {
            const success = await updateCollectStatus(item.id, status);
            if (success) {
                closePopup();
            } else {
                // Показать ошибку пользователю
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusIcon = () => {
        switch (item.collectStatus) {
            case 'collected':
                return {
                    icon: faCheck,
                    className: styles['status-collected'],
                    cardClassName: styles['status-collected-card']
                };
            case 'unknown':
                return {
                    icon: faQuestion,
                    className: styles['status-unknown'],
                    cardClassName: styles['status-unknown-card']
                };
            case 'will-not-collect':
                return {
                    icon: faBan,
                    className: styles['status-will-not-collect'],
                    cardClassName: styles['status-will-not-collect-card']
                };
            default:
                return {
                    icon: faQuestion,
                    className: styles['status-unknown'],
                    cardClassName: styles['status-unknown-card']
                };
        }
    };

    const statusIcon = getStatusIcon();

    return (
        <>
            <div
                onClick={openPopup}
                className={`${styles['card']} ${statusIcon.cardClassName} ${isUpdating ? styles['updating'] : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openPopup();
                    }
                }}
                aria-label={`Открыть детали ${item.name}`}
            >
                <div className={`${styles['status-icon']} ${statusIcon.className}`}>
                    <FontAwesomeIcon icon={statusIcon.icon} />
                </div>

                {item.image && (
                    <img
                        src={item.image}
                        alt={item.description}
                        width="120"
                        loading="lazy"
                        onError={(e) => {
                            // Скрываем изображение если оно не загрузилось
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                )}

                {/* Показываем название элемента вместо статичного "MONSTER" */}
                <h1>{item.name}</h1>
                <h2>{item.description}</h2>

                {/* Показываем тип если он есть */}
                {item.type && (
                    <div className={styles['item-type']}>
                        {item.type}
                    </div>
                )}

                {/* Индикатор загрузки */}
                {isUpdating && (
                    <div className={styles['loading-overlay']}>
                        <div className={styles['spinner']} />
                    </div>
                )}
            </div>

            {isPopupOpen && createPortal(
                <CheckCardPopup
                    item={item}
                    onClose={closePopup}
                    onStatusChange={handleStatusChange}
                    isUpdating={isUpdating}
                />,
                document.body
            )}
        </>
    );
};

export default Card;
