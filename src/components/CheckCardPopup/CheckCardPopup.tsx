import * as React from "react";
import styles from './CheckCardPopup.module.css';
import type {Energetic} from "../../types/Energetic.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons'

interface CheckCardPopupProps {
    energetic: Energetic | null;
    onClose: () => void;
    onStatusChange: (status: 'unknown' | 'collected' | 'will-not-collect') => void;
}

const CheckCardPopup: React.FC<CheckCardPopupProps> = ({energetic, onClose, onStatusChange}) => {
    if (!energetic) return null;

    const handleStatusChange = (status: 'unknown' | 'collected' | 'will-not-collect') => {
        onStatusChange(status);
        onClose();
    };

    return (
        <div className={styles['popup-overlay']} onClick={onClose}>
            <div className={styles['popup-content']} onClick={(e) => e.stopPropagation()}>
                <button className={styles['close-button']} onClick={onClose}>×</button>
                <div className={styles['popup-content__header']}>
                    <h2>{energetic.description}</h2>
                    <img src={energetic.image} alt="energetic-img" width="30" />
                </div>

                <button
                    className={`${styles['popup-button']}`}
                    onClick={() => handleStatusChange('collected')}
                >
                    <FontAwesomeIcon icon={faCheck}/> Collected
                </button>

                <button
                    className={`${styles['popup-button']} ${styles['not-collect']}`}
                    onClick={() => handleStatusChange('unknown')}
                >
                    <FontAwesomeIcon icon={faXmark}/> Not collected
                </button>

                <button
                    className={`${styles['popup-button']} ${styles['will-not-collect']}`}
                    onClick={() => handleStatusChange('will-not-collect')}
                >
                    <FontAwesomeIcon icon={faBan}/> Will not collect
                </button>
            </div>
        </div>
    );
};

export default CheckCardPopup;
