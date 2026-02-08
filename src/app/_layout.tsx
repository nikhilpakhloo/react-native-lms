import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../../global.css";
import { useAuthStore } from "../store/useAuthStore";

import { OfflineBanner } from "../components/OfflineBanner";
import { useCourseStore } from "../store/useCourseStore";
import { NotificationService } from "../utils/notifications";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize: initAuth } = useAuthStore();
  const initCourse = useCourseStore((state) => state.initialize);

  // Initialize auth and course state on app start
  useEffect(() => {
    initAuth();
    initCourse();

    // Notifications
    NotificationService.requestPermissions();
    NotificationService.scheduleInactivityReminder();

    // Safeguard: Force loading to false if it takes too long
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().isLoading) {
        useAuthStore.setState({ isLoading: false });
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/courses");
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
