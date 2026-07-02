import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Storage } from './storage';

const INACTIVITY_NOTIFICATION_ID_KEY = 'inactivity_notification_id';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    async requestPermissions() {
        if (Platform.OS === 'web') return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    },

    async sendLocalNotification(title: string, body: string, data = {}) {
        if (Platform.OS === 'web') return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: 'default',
            },
            trigger: null,
        });
    },

    async scheduleInactivityReminder() {
        if (Platform.OS === 'web') return;

        const existingNotificationId = await Storage.getItem<string>(INACTIVITY_NOTIFICATION_ID_KEY);
        if (existingNotificationId) {
            await Notifications.cancelScheduledNotificationAsync(existingNotificationId);
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Still learning?',
                body: "It's been 24 hours since your last lesson. Keep up the momentum!",
                sound: 'default',
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 24 * 60 * 60,
                repeats: false,
            },
        });

        await Storage.setItem(INACTIVITY_NOTIFICATION_ID_KEY, notificationId);
    },
};
