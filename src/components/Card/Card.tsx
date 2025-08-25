"use client";

import type {Energetic} from "@/types/Energetic";
import styles from './Card.module.css';
import * as React from "react";
import {useState} from "react";
import CheckCardPopup from "@/components/CheckCardPopup/CheckCardPopup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faQuestion} from '@fortawesome/free-solid-svg-icons';
import {useEnergetic} from "@/contexts/EnergeticContext";
import {createPortal} from "react-dom";

interface CardProps {
    energetic: Energetic
}

const Card: React.FC<CardProps> = ({energetic}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { updateCollectStatus } = useEnergetic();

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleStatusChange = (status: 'unknown' | 'collected' | 'will-not-collect') => {
        updateCollectStatus(energetic.id, status);
        closePopup();
    };

    const getStatusIcon = () => {
        switch (energetic.collect) {
            case 'collected':
                return {
                    icon: faCheck,
                    className: styles['status-collected'],
                    cardClassName: styles['status-collected-card']
                };
            case 'unknown':
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

                <img src={energetic.image} alt={energetic.description} width="120"/>
                <h1>MONSTER</h1>
                <h2>{energetic.description}</h2>
            </div>
            {isPopupOpen && createPortal(
                <CheckCardPopup
                    energetic={energetic}
                    onClose={closePopup}
                    onStatusChange={handleStatusChange}
                />,
                document.body
            )}
        </>
    )
}

export default Card;
