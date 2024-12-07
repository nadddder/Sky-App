// app/hooks/use-body-pain-modal.ts
import { create } from 'zustand';

interface BodyPainModalStore {
    isVisible: boolean;
    nextRoute?: string;
    isAnimating: boolean;
    open: (nextRoute?: string) => void;
    close: () => void;
    toggle: () => void;
    setAnimating: (isAnimating: boolean) => void;
}

export const useBodyPainModal = create<BodyPainModalStore>((set, get) => ({
    isVisible: false,
    nextRoute: undefined,
    isAnimating: false,
    open: (nextRoute) => {
        const state = get();
        if (!state.isVisible && !state.isAnimating) {
            set({ isVisible: true, nextRoute, isAnimating: true });
            // Reset animating state after animation completes
            setTimeout(() => set({ isAnimating: false }), 300);
        }
    },
    close: () => {
        const state = get();
        if (state.isVisible && !state.isAnimating) {
            set({ isAnimating: true });
            // Allow animation to complete before hiding
            setTimeout(() => {
                set({ isVisible: false, nextRoute: undefined, isAnimating: false });
            }, 300);
        }
    },
    toggle: () => {
        const state = get();
        if (!state.isAnimating) {
            state.isVisible ? state.close() : state.open();
        }
    },
    setAnimating: (isAnimating) => set({ isAnimating })
}));