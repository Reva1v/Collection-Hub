"use client";

import * as React from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    variant?: 'default' | 'centered' | 'compact';
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          description,
                                                          className,
                                                          variant = 'default',
                                                          children
                                                      }) => {
    const headerClasses = [
        styles["page-header"],
        variant !== 'default' && styles[variant],
        className
    ].filter(Boolean).join(' ');
    return (
        <header className={headerClasses}>
            <div className={styles["header-content"]}>
                <h1 className={styles["header-title"]}>{title}</h1>
                {description && (
                    <p className={styles["header-description"]}>{description}</p>
                )}
            </div>
            {children && (
                <div className={styles["header-actions"]}>
                    {children}
                </div>
            )}
        </header>
    );
};
