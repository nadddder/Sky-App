// components/onboarding/next-button.tsx
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';

interface NextButtonProps {
    onNext: () => void;
    disabled?: boolean;
    label?: string;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
}

export function NextButton({
    onNext,
    disabled = false,
    label = 'Continue',
    className = "",
    variant = "outline"
}: NextButtonProps) {
    return (
        <Button
            variant={variant}
            onPress={onNext}
            disabled={disabled}
            className={cn(className)}
            size="lg"
        >
            {label}
        </Button>
    );
}
