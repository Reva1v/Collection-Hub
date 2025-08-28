import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
    overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'medium',
                                                           className = '',
                                                           overlay = false
                                                       }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-20 h-20'
    };

    const spinner = (
        <div
            className={`animate-spin rounded-full border-4 border-neutral-600 border-t-neutral-700 ${sizeClasses[size]} ${className}`}
        />
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
