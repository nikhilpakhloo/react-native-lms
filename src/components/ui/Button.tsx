import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    loading = false,
    variant = 'primary',
    size = 'md',
    disabled,
    ...props
}) => {
    const sizeClasses = {
        sm: 'py-2 px-4',
        md: 'py-4 px-6',
        lg: 'py-5 px-8',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                disabled={disabled || loading}
                activeOpacity={0.8}
                {...props}
            >
                <LinearGradient
                    colors={
                        disabled || loading
                            ? ['#9CA3AF', '#6B7280']
                            : ['#3B82F6', '#1D4ED8']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className={`rounded-xl ${sizeClasses[size]} items-center justify-center shadow-lg`}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text
                            className={`${textSizeClasses[size]} font-bold text-white`}
                        >
                            {title}
                        </Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                disabled={disabled || loading}
                activeOpacity={0.8}
                className={`${sizeClasses[size]} border-2 border-blue-500 rounded-xl items-center justify-center`}
                {...props}
            >
                {loading ? (
                    <ActivityIndicator color="#3B82F6" />
                ) : (
                    <Text
                        className={`${textSizeClasses[size]} font-bold text-blue-500`}
                    >
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            disabled={disabled || loading}
            activeOpacity={0.8}
            className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-xl items-center justify-center`}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="#3B82F6" />
            ) : (
                <Text
                    className={`${textSizeClasses[size]} font-bold text-gray-900 dark:text-white`}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};
