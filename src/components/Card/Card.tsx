import type {Energetic} from "../../types/Energetic.ts";
import styles from './Card.module.css';
import * as React from "react";
import {useState} from "react";
import CheckCardPopup from "../CheckCardPopup/CheckCardPopup.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faQuestion} from '@fortawesome/free-solid-svg-icons';

interface CardProps {
    energetic: Energetic
}

const Card: React.FC<CardProps> = ({energetic}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [collectStatus, setCollectStatus] = useState<'collected' | 'not-collected' | 'will-not-collect' | 'unknown'>('unknown');

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const getStatusIcon = () => {
        switch (collectStatus) {
            case 'collected':
                return {
                    icon: faCheck,
                    className: styles['status-collected'],
                    cardClassName: styles['status-collected-card']
                };
            case 'not-collected':
                return {icon: faQuestion, className: styles['status-unknown']};
            case 'will-not-collect':
                return {
                    icon: faBan,
                    className: styles['status-will-not-collect'],
                    cardClassName: styles['status-will-not-collect-card']
                };
            default:
                return {icon: faQuestion, className: styles['status-unknown']};
        }
    };

    const statusIcon = getStatusIcon();

    return (
        <>
            <div onClick={openPopup} className={`${styles['card']} ${statusIcon.cardClassName}`}>
                <div className={`${styles['status-icon']} ${statusIcon.className}`}>
                    <FontAwesomeIcon icon={statusIcon.icon}/>
                </div>

                <img src={energetic.image} alt="energetic-img" width="120"/>
                <h1>MONSTER</h1>
                <h2>{energetic.description}</h2>
            </div>
            {isPopupOpen && (
                <CheckCardPopup
                    energetic={energetic}
                    onClose={closePopup}
                    currentStatus={collectStatus}
                    onStatusChange={setCollectStatus}
                />
            )}
        </>
    )
}

export default Card;
