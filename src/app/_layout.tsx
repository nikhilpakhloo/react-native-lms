import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../../global.css";
import { useAuthStore } from "../store/useAuthStore";

import { OfflineBanner } from "../components/OfflineBanner";
import { ThemeProvider, useTheme } from "../providers/ThemeProvider";
import { useCourseStore } from "../store/useCourseStore";
import { NotificationService } from "../utils/notifications";

function RootLayoutContent() {
  const segments = useSegments();
  const router = useRouter();
  const theme = useTheme();
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
  }, [initAuth, initCourse]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/courses");
    }
  }, [isAuthenticated, isLoading, router, segments]);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color={theme.colors.iconMuted} />
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
