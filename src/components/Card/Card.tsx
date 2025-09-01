"use client";

import type { Item, CollectStatus } from "@/lib/types/Item";
import styles from './Card.module.css';
import * as React from "react";
import { useState, useTransition } from "react";
import CheckCardPopup from "@/components/CheckCardPopup/CheckCardPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from "react-dom";
import { updateCollectStatus } from "@/lib/items/actions"; // теперь тянем экшен напрямую

interface CardProps {
    item: Item;
}

const Card: React.FC<CardProps> = ({ item }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [localStatus, setLocalStatus] = useState<CollectStatus>(item.collectStatus);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleStatusChange = (status: CollectStatus) => {
        startTransition(async () => {
            const result = await updateCollectStatus(item.id, status);
            if (result.success) {
                setLocalStatus(status);
                closePopup();
            } else {
                console.error("Failed to update status", result.error);
            }
        });
    };

    const getStatusIcon = () => {
        switch (localStatus) {
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
                className={`${styles['card']} ${statusIcon.cardClassName} ${isPending ? styles['updating'] : ''}`}
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
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                )}

                <h1>{item.name}</h1>
                <h2>{item.description}</h2>

                {item.type && (
                    <div className={styles['item-type']}>
                        {item.type}
                    </div>
                )}

                {isPending && (
                    <div className={styles['loading-overlay']}>
                        <div className={styles['spinner']} />
                    </div>
                )}
            </div>

            {isPopupOpen && createPortal(
                <CheckCardPopup
                    item={{ ...item, collectStatus: localStatus }}
                    onClose={closePopup}
                    onStatusChange={handleStatusChange}
                    isUpdating={isPending}
                />,
                document.body
            )}
        </>
    );
};

export default Card;
