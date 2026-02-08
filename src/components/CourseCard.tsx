import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Product, RandomUser } from '../api/courses';
import { useCourseStore } from '../store/useCourseStore';

interface CourseCardProps {
    course: Product;
    instructor?: RandomUser;
    onPress?: () => void;
    percentage?: number;
}

export const CourseCard = React.memo<CourseCardProps>(({ course, instructor, onPress, percentage }) => {
    const { bookmarks, toggleBookmark } = useCourseStore();
    const isBookmarked = bookmarks.includes(course.id);
    const [imageError, setImageError] = React.useState(false);

    // Fallback logic: Use first image if thumbnail fails
    const imageSource = imageError && course.images?.[0]
        ? { uri: course.images[0] }
        : { uri: course.thumbnail };

    const showProgress = typeof percentage === 'number';

    return (
        <Pressable
            onPress={onPress}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform"
        >
            {/* Thumbnail */}
            <View className="relative h-52 w-full bg-gray-100 dark:bg-gray-700">
                {course.thumbnail && !imageError ? (
                    <Image
                        source={imageSource}
                        className="w-full h-full"
                        contentFit="cover"
                        transition={300}
                        cachePolicy="memory-disk"
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs mt-2 font-medium">Preview not available</Text>
                    </View>
                )}

                {/* Rating Badge */}
                <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center border border-white/20">
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text className="text-white text-xs font-bold ml-1">{course.rating}</Text>
                </View>

                {/* Bookmark Button */}
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        toggleBookmark(course.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-sm"
                >
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isBookmarked ? "#3B82F6" : "#4B5563"}
                    />
                </Pressable>

                {/* Status/Price Overlay */}
                <View className="absolute bottom-4 right-4">
                    {showProgress ? (
                        <View className="bg-green-500/90 px-3 py-1.5 rounded-xl border border-white/20">
                            <Text className="text-white font-bold text-xs">
                                {percentage === 100 ? 'Completed' : 'In Progress'}
                            </Text>
                        </View>
                    ) : (
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="px-4 py-1.5 rounded-xl shadow-md border border-white/20"
                        >
                            <Text className="text-white font-bold text-base">${course.price}</Text>
                        </LinearGradient>
                    )}
                </View>
            </View>

            {/* Content */}
            <View className="p-5">
                <Text className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                    {course.category}
                </Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-7" numberOfLines={2}>
                    {course.title}
                </Text>

                {/* Progress Bar Injection */}
                {showProgress && (
                    <View className="mt-2 mb-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xs font-bold text-gray-500">Course Progress</Text>
                            <Text className="text-xs font-bold text-blue-600">{percentage}%</Text>
                        </View>
                        <View className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${percentage}%` }}
                            />
                        </View>
                    </View>
                )}

                {/* Instructor & Info */}
                <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-gray-50 dark:border-gray-700">
                    {instructor ? (
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: instructor.picture.thumbnail }}
                                className="w-8 h-8 rounded-full bg-gray-200"
                                contentFit="cover"
                            />
                            <View className="ml-2">
                                <Text className="text-xs text-gray-500 dark:text-gray-400">Instructor</Text>
                                <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {instructor.name.first} {instructor.name.last}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                                <Ionicons name="person" size={16} color="#9CA3AF" />
                            </View>
                            <Text className="text-sm text-gray-400 ml-2">Loading...</Text>
                        </View>
                    )}

                    {!showProgress && (
                        <View className="flex-row items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                            <Ionicons name="people-outline" size={16} color="#6B7280" />
                            <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-1">
                                {course.stock}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
});
