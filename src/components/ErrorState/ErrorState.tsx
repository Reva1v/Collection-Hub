import * as React from 'react'
import styles from './ErrorState.module.css'

interface Props {
    title?: string
    message: string
    onRetry?: () => void
    retryText?: string
    className?: string
}

export const ErrorState: React.FC<Props> = ({
                                                title = "Something went wrong",
                                                message,
                                                onRetry,
                                                retryText = "Try Again",
                                                className
                                            }) => (
    <div className={`${styles['error-state']} ${className || ''}`}>
        <div className={styles['error-content']}>
            <div className={styles['error-icon']}>⚠️</div>
            <h2>{title}</h2>
            <p>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className={styles['retry-button']}
                >
                    {retryText}
                </button>
            )}
        </div>
    </div>
)
