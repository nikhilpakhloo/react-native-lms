import React, { useEffect } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SkeletonProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
    const opacity = new Animated.Value(0.3);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#E5E7EB', // Default light mode gray-200
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const CourseCardSkeleton = () => (
    <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
        <Skeleton width="100%" height={208} borderRadius={0} />
        <View className="p-5">
            <Skeleton width={80} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={20} borderRadius={6} style={{ marginBottom: 8 }} />
            <Skeleton width="70%" height={20} borderRadius={6} style={{ marginBottom: 16 }} />

            <View className="flex-row items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                <View className="flex-row items-center">
                    <Skeleton width={32} height={32} borderRadius={16} />
                    <View className="ml-2">
                        <Skeleton width={40} height={8} borderRadius={4} style={{ marginBottom: 4 }} />
                        <Skeleton width={60} height={12} borderRadius={4} />
                    </View>
                </View>
                <Skeleton width={80} height={24} borderRadius={8} />
            </View>
        </View>
    </View>
);

export const CategorySkeleton = () => (
    <View className="flex-row px-6 mb-4">
        {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={80} height={40} borderRadius={20} style={{ marginRight: 12 }} />
        ))}
    </View>
);
