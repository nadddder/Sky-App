import { memo } from "react";
import { TextInput, View, Text } from "react-native";
import { Input } from "../ui/input";

const NameContent = memo(function NameContent({
    value,
    error,
    onChangeText,
    inputRef,
}: {
    value: string;
    error: string;
    onChangeText: (text: string) => void;
    inputRef: React.RefObject<TextInput>;
}) {
    return (
        <View className="justify-center flex-1">
            <Text className="mb-2 text-2xl font-bold text-center text-gray-900">
                Let's get to know you better
            </Text>

            <Text className="mb-8 text-lg text-center text-gray-600">
                First, what can I call you?
            </Text>

            <Input
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                placeholder="Enter your name"
                error={error}
                className="text-lg text-center"
                placeholderClassName="text-gray-400"
                autoFocus
                autoCapitalize="words"
                testID="name-input"
            />
        </View>
    );
});

export default NameContent