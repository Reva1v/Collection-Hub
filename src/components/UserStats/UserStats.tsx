"use client";

import * as React from "react";
import styles from "./UserStats.module.css";

interface StatCardProps {
    icon: string;
    number: number;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label }) => (
    <div className={styles["stat-card"]}>
        <div className={styles["stat-icon"]}>{icon}</div>
        <div className={styles["stat-info"]}>
            <div className={styles["stat-number"]}>{number}</div>
            <div className={styles["stat-label"]}>{label}</div>
        </div>
    </div>
);

interface UserStatsProps {
    totalCollections: number;
    totalItems: number;
    memberSince: string | number;
}

export const UserStats: React.FC<UserStatsProps> = ({
                                                        totalCollections,
                                                        totalItems,
                                                        memberSince
                                                    }) => {
    const daysActive = React.useMemo(() => {
        const createdDate = new Date(memberSince).getTime();
        return Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
    }, [memberSince]);

    const stats = React.useMemo(() => [
        {
            icon: "📚",
            number: totalCollections,
            label: "Collections"
        },
        {
            icon: "📦",
            number: totalItems,
            label: "Total Items"
        },
        {
            icon: "📅",
            number: daysActive,
            label: "Days Active"
        }
    ], [totalCollections, totalItems, daysActive]);

    return (
        <div className={styles["stats-section"]}>
            <h2>Your Statistics</h2>
            <div className={styles["stats-grid"]}>
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        icon={stat.icon}
                        number={stat.number}
                        label={stat.label}
                    />
                ))}
            </div>
        </div>
    );
};
