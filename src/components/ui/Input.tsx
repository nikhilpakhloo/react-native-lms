import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
}

export const Input = React.forwardRef<TextInput, InputProps>(
    ({ label, error, icon, isPassword, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const theme = useTheme();

        return (
            <View className="mb-4">
                <Text
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    style={{ color: theme.colors.mutedText }}
                >
                    {label}
                </Text>
                <View className="relative">
                    <View
                        className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        style={[
                            styles.inputShell,
                            {
                                backgroundColor: theme.colors.inputBackground,
                                borderColor: theme.colors.border,
                            },
                        ]}
                    >
                        {icon && (
                            <View className="pl-4">
                                <Ionicons
                                    name={icon}
                                    size={20}
                                    color={theme.colors.iconMuted}
                                />
                            </View>
                        )}
                        <TextInput
                            ref={ref}
                            className="flex-1 px-4 text-base text-gray-900 dark:text-white"
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholderTextColor={theme.colors.placeholder}
                            secureTextEntry={isPassword && !showPassword}
                            autoCapitalize="none"
                            {...props}
                        />
                        {isPassword && (
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="pr-4"
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={theme.colors.iconMuted}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {error && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    inputShell: {
        minHeight: 58,
        borderRadius: 18,
    },
    input: {
        minHeight: 54,
    },
});
