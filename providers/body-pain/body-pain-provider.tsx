import { memo } from 'react';
import { BodyPainModal } from './body-pain-modal';
import { useBodyPainModal } from '~/hooks/body-pain/use-body-pain-modal';

interface BodyPainProviderProps {
    children: React.ReactNode;
}

export const BodyPainProvider = memo(function BodyPainProvider({
    children
}: BodyPainProviderProps) {
    const { isVisible, close } = useBodyPainModal();

    return (
        <>
            {children}
            <BodyPainModal isVisible={isVisible} onClose={close} />
        </>
    );
});