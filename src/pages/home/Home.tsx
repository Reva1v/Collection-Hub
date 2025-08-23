import * as React from 'react'
import styles from './Home.module.css'
import CardList from "../../components/CardList/CardList.tsx";
import energeticsData from "../../assets/data/energetics.json";
import type {Energetic} from "../../types/Energetic.ts";
import ClickSpark from '../../components/ClickSpark/ClickSpark.tsx';

const Home: React.FC = () => {

    const energetics = energeticsData as Energetic[];

    return (
        <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
        >
        <div className={styles['home']}>
            <div className={styles['main-board']}>
                <CardList energetics={energetics}/>
            </div>
        </div>
        </ClickSpark>
    )
}

export default Home
