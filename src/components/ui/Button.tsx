import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';
import { BUTTON_COLORS, BUTTON_STYLES } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    loading = false,
    variant = 'primary',
    size = 'md',
    disabled,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const sizeClasses = {
        sm: 'px-4',
        md: 'px-6',
        lg: 'px-8',
    };

    const sizeStyles: Record<NonNullable<ButtonProps['size']>, ViewStyle> = {
        sm: { minHeight: 44 },
        md: { minHeight: 52 },
        lg: { minHeight: 60 },
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
                className={`rounded-2xl overflow-hidden ${className ?? ''}`}
                style={[
                    styles.touchable,
                    disabled || loading ? styles.disabled : undefined,
                    style,
                ]}
                {...props}
            >
                <LinearGradient
                    colors={
                        disabled || loading
                            ? BUTTON_COLORS.disabledGradient
                            : BUTTON_COLORS.primaryGradient
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className={`${sizeClasses[size]} items-center justify-center shadow-lg`}
                    style={[styles.button, sizeStyles[size]]}
                >
                    {loading ? (
                        <ActivityIndicator color={BUTTON_COLORS.spinnerOnPrimary} />
                    ) : (
                        <Text
                            className={`${textSizeClasses[size]} font-bold text-white`}
                            numberOfLines={1}
                            style={styles.label}
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
                className={`${sizeClasses[size]} border-2 ${BUTTON_STYLES.outlineBorder} rounded-2xl items-center justify-center ${className ?? ''}`}
                style={[
                    styles.button,
                    sizeStyles[size],
                    disabled || loading ? styles.disabled : undefined,
                    style,
                ]}
                {...props}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.iconMuted} />
                ) : (
                    <Text
                        className={`${textSizeClasses[size]} font-bold ${BUTTON_STYLES.outlineText}`}
                        numberOfLines={1}
                        style={styles.label}
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
            className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-2xl items-center justify-center ${className ?? ''}`}
            style={[
                styles.button,
                sizeStyles[size],
                disabled || loading ? styles.disabled : undefined,
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.iconMuted} />
            ) : (
                <Text
                    className={`${textSizeClasses[size]} font-bold text-gray-900 dark:text-white`}
                    numberOfLines={1}
                    style={styles.label}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
        alignSelf: 'stretch',
    },
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    label: {
        width: '100%',
        textAlign: 'center',
        includeFontPadding: false,
    },
    disabled: {
        opacity: 0.72,
    },
});
