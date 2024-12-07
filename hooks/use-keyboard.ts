// src/hooks/use-keyboard.ts
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform, LayoutAnimation } from 'react-native';

interface KeyboardInfo {
    keyboardHeight: number;
    keyboardVisible: boolean;
    dismiss: () => void;
}

export function useKeyboard(enableAnimation = true): KeyboardInfo {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event: KeyboardEvent) => {
                if (enableAnimation) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                setKeyboardHeight(event.endCoordinates.height);
                setKeyboardVisible(true);
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                if (enableAnimation) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                setKeyboardHeight(0);
                setKeyboardVisible(false);
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [enableAnimation]);

    const dismiss = () => {
        Keyboard.dismiss();
    };

    return { keyboardHeight, keyboardVisible, dismiss };
}

export function useDismissKeyboard(refs: React.RefObject<any>[]) {
    useEffect(() => {
        const handleKeyboardDismiss = () => {
            refs.forEach(ref => {
                if (ref.current?.blur) {
                    ref.current.blur();
                }
            });
        };

        const keyboardDidHideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            handleKeyboardDismiss
        );

        return () => {
            keyboardDidHideSubscription.remove();
        };
    }, [refs]);
}