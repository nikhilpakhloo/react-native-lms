import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

export default function TabsLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: theme.colors.iconMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1.5,
                    borderTopColor: theme.colors.border,
                    height: 80,
                    paddingBottom: 12,
                    paddingTop: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 4,
                },
                sceneStyle: {
                    backgroundColor: theme.colors.background,
                },
            }}
        >
            <Tabs.Screen
                name="courses"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="my-courses"
                options={{
                    title: 'My Learning',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="play-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookmarks"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bookmark" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
