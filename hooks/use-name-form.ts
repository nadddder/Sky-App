// hooks/use-name-form.ts
import { useState, useCallback, useRef } from 'react';
import { TextInput } from 'react-native';

interface NameFormState {
    name: string;
    error: string;
}

export function useNameForm() {
    const [formState, setFormState] = useState<NameFormState>({
        name: '',
        error: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleChangeText = useCallback((text: string) => {
        setFormState(prev => ({
            ...prev,
            name: text,
            error: ''
        }));
    }, []);

    const validateName = useCallback((): boolean => {
        const trimmedName = formState.name.trim();

        if (trimmedName.length < 2) {
            setFormState(prev => ({
                ...prev,
                error: 'Please enter a valid name (minimum 2 characters)'
            }));
            inputRef.current?.focus();
            return false;
        }

        if (trimmedName.length > 50) {
            setFormState(prev => ({
                ...prev,
                error: 'Name is too long (maximum 50 characters)'
            }));
            inputRef.current?.focus();
            return false;
        }

        // Basic regex to check for valid name characters
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(trimmedName)) {
            setFormState(prev => ({
                ...prev,
                error: 'Please use only letters, spaces, hyphens, and apostrophes'
            }));
            inputRef.current?.focus();
            return false;
        }

        return true;
    }, [formState.name]);

    return {
        formState,
        isSubmitting,
        setIsSubmitting,
        handleChangeText,
        validateName,
        inputRef
    };
}