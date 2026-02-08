import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCourseStore } from '../../store/useCourseStore';
import { NotificationService } from '../../utils/notifications';

const { width } = Dimensions.get('window');

export default function CourseDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { courses, instructors, bookmarks, enrolled, toggleBookmark, enrollCourse } = useCourseStore();

    const course = courses.find(c => c.id.toString() === id);
    const instructor = course ? instructors[course.id] : null;
    const isBookmarked = course ? bookmarks.includes(course.id) : false;
    const isEnrolled = course ? enrolled.includes(course.id) : false;

    if (!course) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
                <Text className="text-gray-500">Course not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4">
                    <Text className="text-blue-500 font-bold">Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const handleEnroll = () => {
        if (isEnrolled) {
            router.push('/(tabs)/my-courses' as any);
            return;
        }

        enrollCourse(course.id);

        // Send success notification
        NotificationService.sendLocalNotification(
            "Enrollment Success! 🎉",
            `Welcome to ${course.title}. Your lesson is waiting for you!`
        );

        import('react-native').then(({ Alert }) => {
            Alert.alert(
                "Congratulations!",
                `You have successfully enrolled in ${course.title}. Ready to start learning?`,
                [
                    { text: "Later", style: "cancel" },
                    { text: "Start Learning", onPress: () => router.push('/(tabs)/my-courses' as any) }
                ]
            );
        });
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-900">
            <ScrollView className="flex-1" bounces={false} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View className="relative h-[400px]">
                    <Image
                        source={{ uri: course.thumbnail }}
                        className="w-full h-full"
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute bottom-0 left-0 right-0 h-40"
                    />

                    {/* Back Button */}
                    <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-6 pt-4">
                        <Pressable
                            onPress={() => router.back()}
                            className="bg-white/90 dark:bg-gray-900/90 p-2.5 rounded-2xl shadow-sm"
                        >
                            <Ionicons name="chevron-back" size={24} color="#1F2937" className="dark:color-white" />
                        </Pressable>
                        <Pressable
                            onPress={() => toggleBookmark(course.id)}
                            className="bg-white/90 dark:bg-gray-900/90 p-2.5 rounded-2xl shadow-sm"
                        >
                            <Ionicons
                                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={isBookmarked ? "#3B82F6" : "#1F2937"}
                            />
                        </Pressable>
                    </SafeAreaView>

                    {/* Title Overlay */}
                    <View className="absolute bottom-8 left-6 right-6">
                        <View className="bg-blue-600 self-start px-3 py-1 rounded-lg mb-3">
                            <Text className="text-white text-xs font-bold uppercase tracking-widest">
                                {course.category}
                            </Text>
                        </View>
                        <Text className="text-3xl font-bold text-white leading-10">
                            {course.title}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View className="p-6 -mt-6 bg-white dark:bg-gray-900 rounded-t-[40px] shadow-2xl">
                    {/* Stats Row */}
                    <View className="flex-row justify-between mb-8">
                        <View className="items-center">
                            <View className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-2xl mb-2">
                                <Ionicons name="star" size={20} color="#F59E0B" />
                            </View>
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{course.rating}</Text>
                            <Text className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Rating</Text>
                        </View>
                        <View className="items-center">
                            <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl mb-2">
                                <Ionicons name="people" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{course.stock}</Text>
                            <Text className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Enrolled</Text>
                        </View>
                        <View className="items-center">
                            <View className="bg-green-50 dark:bg-green-900/20 p-3 rounded-2xl mb-2">
                                <Ionicons name="time" size={20} color="#10B981" />
                            </View>
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">12h 30m</Text>
                            <Text className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Duration</Text>
                        </View>
                    </View>

                    {/* Instructor Card */}
                    {instructor && (
                        <View className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl mb-8 flex-row items-center">
                            <Image
                                source={{ uri: instructor.picture.large }}
                                className="w-16 h-16 rounded-2xl"
                                contentFit="cover"
                            />
                            <View className="ml-4 flex-1">
                                <Text className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Instructor</Text>
                                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                                    {instructor.name.first} {instructor.name.last}
                                </Text>
                                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">Expert in {course.category}</Text>
                            </View>
                            <Pressable className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-2xl">
                                <Ionicons name="chatbubble-ellipses" size={20} color="#3B82F6" />
                            </Pressable>
                        </View>
                    )}

                    {/* Description */}
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the Course</Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-base leading-7 mb-8">
                        {course.description}
                    </Text>

                    {/* Placeholder for Curriculum */}
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Content</Text>
                    {[1, 2, 3].map((item) => (
                        <View key={item} className="flex-row items-center mb-4 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                            <View className="bg-gray-100 dark:bg-gray-800 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                <Text className="font-bold text-gray-600 dark:text-gray-400">0{item}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-900 dark:text-white">Chapter {item}: Fundamentals</Text>
                                <Text className="text-xs text-gray-500">Video • 15 mins</Text>
                            </View>
                            <Ionicons name="play-circle" size={24} color="#3B82F6" />
                        </View>
                    ))}

                    {/* Add extra padding at bottom for the fixed button */}
                    <View className="h-32" />
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-900/90 border-t border-gray-100 dark:border-gray-800">
                <View className="flex-row items-center">
                    <View className="mr-8">
                        <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Total Price</Text>
                        <Text className="text-3xl font-bold text-gray-900 dark:text-white">${course.price}</Text>
                    </View>
                    <Pressable onPress={handleEnroll} className="flex-1">
                        <LinearGradient
                            colors={isEnrolled ? ['#10B981', '#059669'] : ['#3B82F6', '#2563EB']}
                            className="py-4 rounded-3xl items-center shadow-lg"
                        >
                            <Text className="text-white font-bold text-lg">
                                {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
