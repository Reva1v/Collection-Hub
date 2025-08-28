"use client";

import * as React from 'react';
import styles from '@/app/Home.module.css';
import { useApp } from "@/contexts/AppContext.tsx";

const HomePage: React.FC = () => {
    const { user } = useApp(); // предполагая что у вас есть информация о пользователе

    // if (!isAuthenticated) {
    //     return (
    //         <div className={styles.container}>
    //             <div className={styles.welcome}>
    //                 <h1>Welcome to Collection Manager</h1>
    //                 <p>Please log in to access your collections and manage your items.</p>
    //                 <button className={styles.loginButton}                             onClick={() => {
    //
    //                     window.location.href = '/login';
    //                 }}>
    //                     Log In
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>
                    Welcome back{user?.username ? `, ${user.username}` : ''}!
                </h1>
                <p className={styles.subtitle}>
                    Manage your collections and discover amazing items
                </p>
            </div>

            <div className={styles.navigation}>
                <div className={styles.navGrid}>
                    <div className={styles.navCard}>
                        <div className={styles.cardIcon}>📦</div>
                        <h3>My Collections</h3>
                        <p>Browse and manage your item collections</p>
                        <button
                            className={styles.navButton}
                            onClick={() => {
                                // Навигация к странице Items
                                window.location.href = '/collections';
                                // Или если используете Next.js router:
                                // router.push('/items');
                            }}
                        >
                            View Items
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.quickStats}>
                <h2>Quick Overview</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>-</span>
                        <span className={styles.statLabel}>Collections</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>-</span>
                        <span className={styles.statLabel}>Total Items</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>-</span>
                        <span className={styles.statLabel}>Recently Added</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
