import { memo } from "react";
import { View, Text } from "react-native";
import { Gender } from "~/types/onboarding";
import { ChoiceButton } from "../choice-button";

const GenderContent = memo(function GenderContent({
    value,
    onChange
}: {
    value: Gender | null;
    onChange: (gender: Gender) => void;
}) {
    const options: { id: Gender; label: string }[] = [
        { id: 'female', label: 'Female' },
        { id: 'male', label: 'Male' },
        { id: 'non_binary', label: 'Non-binary' },
        { id: 'prefer_not_to_say', label: 'Prefer not to say' }
    ];

    return (
        <View className="flex-1">
            <Text className="mb-8 text-base text-center text-gray-600">
                This helps us tailor safe yoga practices based
                on body mechanics and specific needs.
            </Text>

            {options.map((option) => (
                <ChoiceButton
                    key={option.id}
                    title={option.label}
                    selected={value === option.id}
                    onSelect={() => onChange(option.id)}
                />
            ))}
        </View>
    );
});

export default GenderContent