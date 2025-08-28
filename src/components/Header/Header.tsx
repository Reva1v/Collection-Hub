"use client";

import styles from "./Header.module.css";
import type {FC} from "react";
import FilterByType from "../FilterByType/FilterByType";
import { useApp } from "@/contexts/AppContext";

interface HeaderProps {
    showNav?: boolean;
}

const Header: FC<HeaderProps> = () => {
    const { filteredItems, selectedCollection } = useApp();

    // Считаем собранные элементы среди отфильтрованных
    const collectedCount = filteredItems.filter(item => item.collectStatus === 'collected').length;
    const totalCount = filteredItems.length;

    // Определяем текст для отображения контекста
    const contextText = selectedCollection
        ? `In "${selectedCollection.name}":`
        : "Collected:";

    return (
        <header className={styles.header}>
            <div className={styles.header__inner}>
                <p>{contextText} {collectedCount} of {totalCount}</p>
                <FilterByType />
            </div>
        </header>
    );
};

export default Header;
