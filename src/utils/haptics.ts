import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Utility for consistent haptic feedback across the app.
 * We wrap this to avoid issues on platforms that don't support it (like Web)
 * or to silence errors if it fails.
 */
export const HapticService = {
    /**
     * Light tap for subtle interactions (e.g., search focus, bookmark click)
     */
    light() {
        if (Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    /**
     * Medium tap for standard actions (e.g., button presses, navigation)
     */
    medium() {
        if (Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },

    /**
     * Distinct success feedback (e.g., enrollment, login successful)
     */
    success() {
        if (Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    /**
     * Error feedback (e.g., validation failure, network error)
     */
    error() {
        if (Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },

    /**
     * Warning feedback
     */
    warning() {
        if (Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
};
