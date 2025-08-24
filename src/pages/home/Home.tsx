import * as React from 'react'
import styles from './Home.module.css'
import CardList from "../../components/CardList/CardList.tsx";
import ClickSpark from '../../components/ClickSpark/ClickSpark.tsx';
import Header from "../../components/Header/Header.tsx";

const Home: React.FC = () => {

    return (
        <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
        >
            <Header/>
            <div className={styles['home']}>
                <div className={styles['main-board']}>
                    <CardList/>
                </div>
            </div>
        </ClickSpark>
    )
}

export default Home
