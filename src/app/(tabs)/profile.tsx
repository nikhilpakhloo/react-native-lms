import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
    const { enrolled, bookmarks } = useCourseStore();
    const [uploading, setUploading] = useState(false);

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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
                <Text className="text-gray-600 dark:text-gray-400">
                    No user data available
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#10B981', '#059669', '#047857']}
                    className="pb-24 pt-8"
                >
                    <View className="items-center">
                        {/* Avatar */}
                        <View className="relative">
                            <View className="w-32 h-32 rounded-full bg-white items-center justify-center shadow-lg">
                                {user.avatar?.url ? (
                                    <Image
                                        source={{ uri: user.avatar.url }}
                                        className="w-full h-full rounded-full"
                                    />
                                ) : (
                                    <Ionicons
                                        name="person"
                                        size={64}
                                        color="#10B981"
                                    />
                                )}
                            </View>

                            {/* Edit Avatar Button */}
                            <TouchableOpacity
                                onPress={handleUpdateAvatar}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full items-center justify-center shadow-lg"
                            >
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* User Info */}
                        <Text className="text-2xl font-bold text-white mt-4">
                            {user.username}
                        </Text>
                        <Text className="text-emerald-100 text-base mt-1">
                            {user.email}
                        </Text>
                        <View className="mt-3 px-4 py-1 bg-white/20 rounded-full">
                            <Text className="text-white text-sm font-semibold capitalize">
                                {user.role}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Stats Cards */}
                <View className="px-6 -mt-16">
                    <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
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
                                    {enrolled.length > 0 ? '24%' : '0%'}
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
                    </View>
                </View>

                {/* Menu Items */}
                <View className="px-6 mt-6">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Account Settings
                    </Text>

                    <TouchableOpacity className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                        <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center">
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Edit Profile
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                        <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center">
                            <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Notifications
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                        <View className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center">
                            <Ionicons name="settings-outline" size={20} color="#10B981" />
                        </View>
                        <Text className="flex-1 ml-4 text-base text-gray-900 dark:text-white font-medium">
                            Settings
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View className="px-6 mt-8 mb-8">
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
