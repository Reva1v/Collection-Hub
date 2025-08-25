"use client";

import * as React from 'react'
import styles from './home/Home.module.css'
import CardList from "@/components/CardList/CardList";
import ClickSpark from '@/components/ClickSpark/ClickSpark';
import Header from "@/components/Header/Header";
import {EnergeticProvider} from "@/contexts/EnergeticContext";

const Page: React.FC = () => {

    return (
        <EnergeticProvider>
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
        </EnergeticProvider>
    )
}

export default Page
