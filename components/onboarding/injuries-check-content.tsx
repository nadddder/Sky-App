import { memo, useCallback } from "react";
import { View } from "react-native";
import { useBodyPainModal } from "~/hooks/body-pain/use-body-pain-modal";
import { InjuryStatus } from "~/types/onboarding";
import { Button } from "../ui/button";
import { useRouter } from "expo-router";

const InjuriesContent = memo(function InjuriesContent({
    injuryStatus,
    onSelectStatus
}: {
    injuryStatus: InjuryStatus;
    onSelectStatus: (status: InjuryStatus) => void;
}) {
    const { open, isAnimating } = useBodyPainModal();

    return (
        <View className="flex flex-col gap-4 mt-6">
            <Button
                variant="secondary"
                onPress={() => onSelectStatus('has_injuries')}
                disabled={isAnimating}
            >
                Yes, I could use some extra care!
            </Button>
            <Button
                variant="secondary"
                onPress={() => onSelectStatus('no_injuries')}
            >
                Nope, feeling all good
            </Button>
        </View>
    );
});

export default InjuriesContent