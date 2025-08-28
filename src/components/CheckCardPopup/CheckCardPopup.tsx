"use client";

import React, {useEffect} from 'react';
import type {Item, CollectStatus} from '@/contexts/AppContext';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheck, faQuestion} from '@fortawesome/free-solid-svg-icons';
import styles from './CheckCardPopup.module.css';

interface CheckCardPopupProps {
    item: Item;
    onClose: () => void;
    onStatusChange: (status: CollectStatus) => void;
    isUpdating?: boolean;
}

const CheckCardPopup: React.FC<CheckCardPopupProps> = ({
                                                           item,
                                                           onClose,
                                                           onStatusChange,
                                                           isUpdating = false
                                                       }) => {
    // Закрытие по Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Блокируем скролл body когда попап открыт
    // useEffect(() => {
    //     document.body.style.overflow = 'scroll';
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const statusOptions: Array<{
        status: CollectStatus;
        label: string;
        icon: any;
        className: string;
    }> = [
        {
            status: 'collected',
            label: 'Collected',
            icon: faCheck,
            className: styles['status-collected']
        },
        {
            status: 'unknown',
            label: 'Not Collected',
            icon: faQuestion,
            className: styles['status-unknown']
        },
        {
            status: 'will-not-collect',
            label: 'Will not collect',
            icon: faBan,
            className: styles['status-will-not-collect']
        }
    ];

    return (
        <div
            className={styles['popup-overlay']}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
        >
            <div className={`${styles['popup-content']} ${isUpdating ? styles['updating'] : ''}`}>
                {/* Кнопка закрытия */}
                <button
                    className={styles['close-button']}
                    onClick={onClose}
                    aria-label="Close"
                    disabled={isUpdating}
                >
                    {/*<FontAwesomeIcon icon={faX} />*/}
                    ×
                </button>

                {/* Основная информация */}
                <div className={styles['popup-header']}>
                    {item.image && (
                        <div className={styles['image-container']}>
                            <img
                                src={item.image}
                                alt={item.description}
                                className={styles['popup-image']}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                                width={60}
                            />
                        </div>
                    )}

                    <div className={styles['item-info']}>
                        <h2 id="popup-title" className={styles['item-name']}>
                            {item.description}
                        </h2>
                    </div>
                </div>

                {/* Кнопки изменения статуса */}
                <div className={styles['status-buttons']}>
                    {statusOptions.map(option => (
                        <button
                            key={option.status}
                            className={`${styles['popup-button']} ${option.className} ${
                                item.collectStatus === option.status ? styles['active'] : ''
                            }`}
                            onClick={() => onStatusChange(option.status)}
                            disabled={isUpdating || item.collectStatus === option.status}
                            aria-pressed={item.collectStatus === option.status}
                        >
                            <FontAwesomeIcon icon={option.icon}/>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Индикатор загрузки */}
                {isUpdating && (
                    <div className={styles['loading-overlay']}>
                        <div className={styles['spinner']}/>
                        <p>Updating status...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckCardPopup;
