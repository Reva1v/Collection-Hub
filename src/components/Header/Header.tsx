import styles from "./Header.module.css";
import type {FC} from "react";
import FilterByType from "../FilterByType/FilterByType";
import { useEnergetic } from "../../contexts/EnergeticContext";

interface HeaderProps {
    showNav?: boolean;
}

const Header: FC<HeaderProps> = () => {
    const { energetics, allEnergetics } = useEnergetic();

    return (
        <header className={styles.header}>
            <div className={styles.header__inner}>
                <p>Collected: {energetics.filter(energetic => energetic.collect === 'collected').length} of {allEnergetics.length}</p>
                <FilterByType />
            </div>
        </header>
    );
};

export default Header;
