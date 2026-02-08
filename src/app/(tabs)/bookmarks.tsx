import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/CourseCard';
import { useCourseStore } from '../../store/useCourseStore';
import { HapticService } from '../../utils/haptics';

export default function BookmarksScreen() {
    const router = useRouter();
    const { courses, bookmarks, instructors, fetchCourses } = useCourseStore();
    const [refreshing, setRefreshing] = React.useState(false);

    const bookmarkedCourses = courses.filter(course => bookmarks.includes(course.id));

    React.useEffect(() => {
        if (courses.length === 0) {
            fetchCourses(20);
        }
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCourses(20);
        setRefreshing(false);
    };

    const renderHeader = () => (
        <View className="px-6 pt-2 pb-2">
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Saved Courses
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-1">
                Courses you've bookmarked for later
            </Text>
        </View>
    );

    const renderEmpty = () => (
        <View className="flex-1 items-center justify-center pt-20 px-10">
            <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                <Ionicons name="bookmark-outline" size={40} color="#94A3B8" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
                No bookmarks yet
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Courses you bookmark will appear here for quick access.
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
            <LegendList
                data={bookmarkedCourses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="px-6">
                        <CourseCard
                            course={item}
                            instructor={instructors[item.id]}
                            onPress={() => {
                                HapticService.medium();
                                router.push({ pathname: '/course/[id]', params: { id: item.id.toString() } } as any);
                            }}
                        />
                    </View>
                )}
                // @ts-ignore
                estimatedItemSize={250}
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
