import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/CourseCard';
import { useCourseStore } from '../../store/useCourseStore';

export default function MyCoursesScreen() {
    const { courses, enrolled, instructors, fetchCourses, progress } = useCourseStore();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const enrolledCourses = courses.filter(course => enrolled.includes(course.id));

    React.useEffect(() => {
        if (courses.length === 0) {
            fetchCourses(20);
        }
    }, []);

    // Calculate average progress
    const totalProgress = enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((acc, curr) => acc + (progress[curr.id] || 0), 0) / enrolledCourses.length)
        : 0;

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCourses(20);
        setRefreshing(false);
    };

    const renderHeader = () => (
        <View className="px-6 pt-1 pb-2">
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                My Learning
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                Continue where you left off
            </Text>

            {/* Progress Overview */}
            <View className="flex-row justify-between mt-5 p-6 bg-blue-600 rounded-[32px] shadow-lg shadow-blue-200">
                <View>
                    <Text className="text-white/80 font-bold uppercase text-xs tracking-widest mb-1">Total Progress</Text>
                    <Text className="text-white text-3xl font-bold">{totalProgress}%</Text>
                </View>
                <View className="items-end">
                    <Text className="text-white/80 font-bold uppercase text-xs tracking-widest mb-1">Courses</Text>
                    <Text className="text-white text-3xl font-bold">{enrolledCourses.length}</Text>
                </View>
            </View>

            <View className="mt-6 mb-2">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">Active Courses</Text>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View className="flex-1 items-center justify-center p-10 mt-10">
            <View className="bg-gray-50 dark:bg-gray-800 p-8 rounded-[40px] items-center">
                <Ionicons name="school-outline" size={80} color="#D1D5DB" />
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-6 text-center">
                    No active courses
                </Text>
                <Text className="text-gray-500 text-center mt-2 mb-8 px-4">
                    Explore our catalog and start your learning journey today!
                </Text>
                <Pressable
                    onPress={() => router.push('/(tabs)/courses' as any)}
                    className="bg-blue-600 px-8 py-4 rounded-2xl shadow-md"
                >
                    <Text className="text-white font-bold text-lg">Browse Courses</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
            <LegendList
                data={enrolledCourses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="px-6">
                        <CourseCard
                            course={item}
                            instructor={instructors[item.id]}
                            percentage={progress[item.id] || 0}
                            onPress={() => router.push({ pathname: '/player/[id]', params: { id: item.id.toString() } } as any)}
                        />
                    </View>
                )}
                // @ts-ignore
                estimatedItemSize={350}
                ItemSeparatorComponent={() => <View className="h-6" />}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </SafeAreaView>
    );
}
