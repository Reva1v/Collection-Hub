import * as React from "react";
import styles from './CheckCardPopup.module.css';
import type {Energetic} from "../../types/Energetic.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons'

interface CheckCardPopupProps {
    energetic: Energetic | null;
    onClose: () => void;
    currentStatus: 'collected' | 'not-collected' | 'will-not-collect' | 'unknown';
    onStatusChange: (status: 'collected' | 'not-collected' | 'will-not-collect') => void;
}

const CheckCardPopup: React.FC<CheckCardPopupProps> = ({energetic, onClose, currentStatus, onStatusChange}) => {
    if (!energetic) return null;

    const handleStatusChange = (status: 'collected' | 'not-collected' | 'will-not-collect') => {
        onStatusChange(status);
        onClose();
    };

    return (
        <div className={styles['popup-overlay']} onClick={onClose}>
            <div className={styles['popup-content']} onClick={(e) => e.stopPropagation()}>
                <button className={styles['close-button']} onClick={onClose}>×</button>
                <h2>{energetic.description}</h2>

                <button
                    className={`${styles['popup-button']} ${currentStatus === 'collected' ? styles['active'] : ''}`}
                    onClick={() => handleStatusChange('collected')}
                >
                    <FontAwesomeIcon icon={faCheck}/> Collected
                </button>

                <button
                    className={`${styles['popup-button']} ${styles['not-collect']} ${currentStatus === 'not-collected' ? styles['active'] : ''}`}
                    onClick={() => handleStatusChange('not-collected')}
                >
                    <FontAwesomeIcon icon={faXmark}/> Not collected
                </button>

                <button
                    className={`${styles['popup-button']} ${styles['will-not-collect']} ${currentStatus === 'will-not-collect' ? styles['active'] : ''}`}
                    onClick={() => handleStatusChange('will-not-collect')}
                >
                    <FontAwesomeIcon icon={faBan}/> Will not collect
                </button>
            </div>
        </div>
    );
};

export default CheckCardPopup;
