"use client";

import {motion, AnimatePresence} from "motion/react";
import React, { useState, useEffect } from "react";

interface LoadingProps {
    text?: string;
    isInitialized?: boolean;
    onComplete?: () => void;
}

export function Loading({ text = "Loading...", isInitialized = false, onComplete }: LoadingProps) {
    const [shouldShow, setShouldShow] = useState(!isInitialized);

    useEffect(() => {
        if (isInitialized && shouldShow) {
            // Запускаем процесс скрытия
            setShouldShow(false);
        } else if (!isInitialized && !shouldShow) {
            // Показываем компонент при необходимости
            setShouldShow(true);
        }
    }, [isInitialized, shouldShow]);

    const handleExitComplete = () => {
        onComplete?.();
    };

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {shouldShow && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
                >
                    <motion.div
                        className="flex flex-col items-center"
                        // initial={{ scale: 0.9, y: 20 }}
                        // animate={{ scale: 1, y: 0 }}
                        // exit={{ scale: 0.9, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {/* Спиннер */}
                        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--secondary)] border-t-[var(--accent)]" />

                        {/* Текст */}
                        <p className="mt-6 text-lg font-medium text-[var(--text)]">
                            {text}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
