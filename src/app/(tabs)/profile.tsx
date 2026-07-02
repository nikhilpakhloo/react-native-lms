import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updateAvatar } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, updateUser } = useAuthStore();
    const { enrolled, bookmarks, progress } = useCourseStore();
    const [uploading, setUploading] = useState(false);

    const completedCourses = React.useMemo(
        () => enrolled.filter((courseId) => progress[courseId] === 100).length,
        [enrolled, progress]
    );

    const averageProgress = React.useMemo(() => {
        if (enrolled.length === 0) return 0;

        const totalProgress = enrolled.reduce(
            (total, courseId) => total + (progress[courseId] ?? 0),
            0
        );

        return Math.round(totalProgress / enrolled.length);
    }, [enrolled, progress]);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    const handleUpdateAvatar = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera roll permissions to update your avatar.'
                );
                return;
            }

            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setUploading(true);
                const response = await updateAvatar(result.assets[0].uri);

                if (response.success && response.data) {
                    const updatedUser = {
                        id: response.data._id,
                        username: response.data.username,
                        email: response.data.email,
                        avatar: response.data.avatar,
                        role: response.data.role,
                    };
                    await updateUser(updatedUser);
                    Alert.alert('Success', 'Profile picture updated successfully!');
                }
            }
        } catch (error: any) {
            Alert.alert(
                'Update Failed',
                error.response?.data?.message || 'Unable to update profile picture.'
            );
        } finally {
            setUploading(false);
        }
    };

    const showComingSoon = (title: string) => {
        Alert.alert(title, 'This setting is planned for the next phase.');
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center px-6">
                <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                    <Ionicons name="person-circle-outline" size={36} color="#64748B" />
                </View>
                <Text className="text-gray-900 dark:text-white text-lg font-bold">
                    No user data available
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                    Sign in again to restore your learning profile.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                <LinearGradient
                    colors={['#0F766E', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pb-24 pt-8 px-6"
                >
                    <View className="flex-row items-center">
                        <View className="relative">
                            <View className="w-24 h-24 rounded-full bg-white/95 items-center justify-center shadow-lg overflow-hidden">
                                {user.avatar?.url ? (
                                    <Image
                                        source={{ uri: user.avatar.url }}
                                        className="w-full h-full rounded-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Ionicons
                                        name="person"
                                        size={44}
                                        color="#0F766E"
                                    />
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={handleUpdateAvatar}
                                disabled={uploading}
                                className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#2563EB" />
                                ) : (
                                    <Ionicons name="camera" size={20} color="#2563EB" />
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 ml-5">
                            <Text className="text-white/80 text-xs font-bold uppercase tracking-widest">
                                Learning Profile
                            </Text>
                            <Text className="text-2xl font-extrabold text-white mt-1" numberOfLines={1}>
                                {user.username}
                            </Text>
                            <Text className="text-blue-50 text-sm mt-1" numberOfLines={1}>
                                {user.email}
                            </Text>
                            <View className="self-start mt-3 px-3 py-1 bg-white/20 rounded-full">
                                <Text className="text-white text-xs font-bold capitalize">
                                    {user.role}
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View className="px-6 -mt-16">
                    <View className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
                        <View className="flex-row justify-around">
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/my-courses')}
                                className="items-center"
                            >
                                <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {enrolled.length}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Courses
                                </Text>
                            </TouchableOpacity>

                            <View className="w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                            <View className="items-center">
                                <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {averageProgress}%
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Progress
                                </Text>
                            </View>

                            <View className="w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/bookmarks')}
                                className="items-center"
                            >
                                <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {bookmarks.length}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Bookmarks
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Overall completion
                                </Text>
                                <Text className="text-sm font-bold text-blue-600">
                                    {completedCourses}/{enrolled.length}
                                </Text>
                            </View>
                            <View className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${averageProgress}%` }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-6 mt-6">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Account Settings
                    </Text>

                    <TouchableOpacity
                        onPress={handleUpdateAvatar}
                        disabled={uploading}
                        className="flex-row items-center bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <View className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full items-center justify-center">
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Update Avatar
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => showComingSoon('Notification Preferences')}
                        className="flex-row items-center bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <View className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full items-center justify-center">
                            <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Notifications
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => showComingSoon('Learning Preferences')}
                        className="flex-row items-center bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <View className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full items-center justify-center">
                            <Ionicons name="settings-outline" size={20} color="#10B981" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Learning Preferences
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View className="px-6 mt-8">
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        size="lg"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
