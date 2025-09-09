import * as React from 'react'
import {createCollection} from '@/lib/collections/actions.ts'
import styles from './CreateCollectionForm.module.css'

interface FormState {
    isSubmitting: boolean
}

interface Props {
    onSuccess: () => void
}

export const CreateCollectionForm: React.FC<Props> = ({ onSuccess }) => {
    const [state, formAction] = React.useActionState(createCollection, null)
    const [formState, setFormState] = React.useState<FormState>({
        isSubmitting: false
    })
    const formRef = React.useRef<HTMLFormElement>(null)

    React.useEffect(() => {
        if (state?.success) {
            formRef.current?.reset()
            setFormState({ isSubmitting: false })
            onSuccess()
        } else if (state?.error) {
            setFormState({ isSubmitting: false })
        }
    }, [state, onSuccess])

    const handleSubmit = async (formData: FormData) => {
        setFormState({ isSubmitting: true })
        formAction(formData)
    }

    return (
        <div className={styles['create-collection']}>
            <h2>Create New Collection</h2>
            <form ref={formRef} action={handleSubmit} className={styles['create-form']}>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Collection name"
                        disabled={formState.isSubmitting}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        disabled={formState.isSubmitting}
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className={styles['create-button']}
                >
                    {formState.isSubmitting ? 'Creating...' : 'Create Collection'}
                </button>

                {state?.error && (
                    <div className={styles['error-message']}>
                        {state.error}
                    </div>
                )}
            </form>
        </div>
    )
}
