import React from 'react';
import Card from '../Card/Card.tsx';
// import type {Energetic} from '../../types/Energetic.ts';
import styles from './CardList.module.css';
import {useEnergetic} from "../../contexts/EnergeticContext.tsx";

// interface CardListProps {
//     energetics: Energetic[];
// }

const CardList: React.FC = () => {
    const { energetics } = useEnergetic();

    return (
        <ul className={styles['card-list']} >
            {energetics.map((energetic) => (
                <Card key={energetic.id} energetic={energetic}/>
            ))}
        </ul>
    );
};

export default CardList;
