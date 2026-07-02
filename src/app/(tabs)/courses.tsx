import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "../../api/courses";
import { CourseCard } from "../../components/CourseCard";
import { CourseCardSkeleton } from "../../components/Skeleton";
import { useOrientation } from "../../hooks/useOrientation";
import { useCourseStore } from "../../store/useCourseStore";
import { HapticService } from "../../utils/haptics";

interface CoursesHeaderProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  recommended: Product[];
  onPressRecommended: (id: string) => void;
  searchHistory: string[];
  onHistoryPress: (query: string) => void;
  isFocused: boolean;
  setIsFocused: (f: boolean) => void;
  onSubmit: () => void;
  onClearHistory: () => void;
}

const CoursePreviewImage = React.memo(({ course }: { course: Product }) => {
  const [imageState, setImageState] = useState({ courseId: course.id, index: 0 });
  const imageIndex = imageState.courseId === course.id ? imageState.index : 0;
  const imageUris = useMemo(
    () =>
      [course.thumbnail, ...(course.images || [])]
        .filter(Boolean)
        .filter((uri, index, list) => list.indexOf(uri) === index),
    [course.images, course.thumbnail],
  );
  const imageUri = imageUris[imageIndex];

  if (!imageUri) {
    return (
      <View className="w-full h-32 bg-gray-100 dark:bg-gray-800 items-center justify-center">
        <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      className="w-full h-32"
      contentFit="cover"
      onError={() =>
        setImageState((currentState) => ({
          courseId: course.id,
          index: currentState.courseId === course.id ? currentState.index + 1 : 1,
        }))
      }
    />
  );
});

CoursePreviewImage.displayName = "CoursePreviewImage";

const CoursesHeader = React.memo(
  ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    recommended,
    onPressRecommended,
    searchHistory,
    onHistoryPress,
    isFocused,
    setIsFocused,
    onSubmit,
    onClearHistory,
  }: CoursesHeaderProps) => (
    <View className="px-6 pt-6 pb-2">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">
            {"Learn what's new today"}
          </Text>
        </View>
      </View>

      {/* Recommendations Section */}
      {recommended.length > 0 &&
        searchQuery === "" &&
        selectedCategory === "All" &&
        !isFocused && (
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Top Picks for You
              </Text>
              <View className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  AI Powered
                </Text>
              </View>
            </View>
            <View className="h-48">
              <FlatList
                data={recommended}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      HapticService.light();
                      onPressRecommended(item.id.toString());
                    }}
                    className="w-[280px] mr-4 bg-gray-50 dark:bg-gray-800/40 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <CoursePreviewImage course={item} />
                    <View className="p-4">
                      <Text className="text-blue-600 font-bold text-[10px] uppercase mb-1">
                        {item.category}
                      </Text>
                      <Text
                        className="text-sm font-bold text-gray-900 dark:text-white mb-2"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-bold text-gray-500">
                          ${item.price}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={12} color="#FBBF24" />
                          <Text className="text-xs font-bold text-gray-900 dark:text-white ml-1">
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          </View>
        )}

      {/* Search Bar */}
      <View
        className={`flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3.5 mb-6 border-2 ${isFocused ? "border-blue-500" : "border-transparent"}`}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? "#3B82F6" : "#9CA3AF"}
        />
        <TextInput
          placeholder="Search courses, categories..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => {
            setIsFocused(true);
            HapticService.light();
          }}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmit}
          className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
        />
        {searchQuery !== "" && (
          <Pressable
            onPress={() => {
              setSearchQuery("");
              HapticService.light();
            }}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {/* Search History */}
      {isFocused && searchHistory.length > 0 && searchQuery === "" && (
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Recent Searches
            </Text>
            <Pressable onPress={onClearHistory}>
              <Text className="text-xs font-bold text-blue-600">Clear All</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap">
            {searchHistory.map((query, idx) => (
              <Pressable
                key={idx}
                onPress={() => onHistoryPress(query)}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl mr-2 mb-2 flex-row items-center border border-gray-200 dark:border-gray-700"
              >
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  {query}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Dynamic Categories */}
      {!isFocused && (
        <View className="mb-4 h-12">
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  HapticService.light();
                  setSelectedCategory(item);
                }}
                className={`px-5 py-2.5 rounded-full mr-3 shadow-sm ${
                  selectedCategory === item
                    ? "bg-blue-600 shadow-blue-200"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <Text
                  className={`font-bold capitalize ${
                    selectedCategory === item
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  ),
);

CoursesHeader.displayName = "CoursesHeader";

export default function CoursesScreen() {
  const {
    courses,
    instructors,
    loading,
    error,
    fetchCourses,
    recommended,
    searchHistory,
    addSearchQuery,
    clearSearchHistory,
  } = useCourseStore();

  const router = useRouter();
  const { isLandscape } = useOrientation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchCourses(15);
  }, [fetchCourses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses(15);
    setRefreshing(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0 && text.length % 3 === 0) {
      HapticService.light();
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addSearchQuery(searchQuery.trim());
      setIsSearchFocused(false);
    }
  };

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((c) => c.category))],
    [courses],
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const instructor = instructors[course.id];
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const instructorName = instructor
          ? `${instructor.name.first} ${instructor.name.last}`.toLowerCase()
          : "";
        const matchesSearch =
          normalizedSearch.length === 0 ||
          course.title.toLowerCase().includes(normalizedSearch) ||
          course.category.toLowerCase().includes(normalizedSearch) ||
          course.description.toLowerCase().includes(normalizedSearch) ||
          instructorName.includes(normalizedSearch);
        const matchesCategory =
          selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [courses, instructors, searchQuery, selectedCategory],
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center p-10 mt-10">
      <Ionicons
        name={error ? "cloud-offline-outline" : "search-outline"}
        size={80}
        color="#D1D5DB"
      />
      <Text className="text-xl font-bold text-gray-900 dark:text-white mt-6">
        {error ? "Catalog unavailable" : "No courses found"}
      </Text>
      <Text className="text-gray-500 text-center mt-2 mb-8">
        {error || "Try adjusting your search query, category, or refreshing."}
      </Text>
      <Pressable
        onPress={() => fetchCourses(15)}
        className="bg-blue-600 px-8 py-4 rounded-2xl shadow-md"
      >
        <Text className="text-white font-bold text-lg">Refresh Catalog</Text>
      </Pressable>
    </View>
  );

  const renderLoading = () => (
    <View className="px-6">
      {[1, 2, 3].map((i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
      <FlatList
        data={loading ? [] : filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`px-6 ${isLandscape ? "w-1/2 max-w-[560px]" : "w-full"}`}
          >
            <CourseCard
              course={item}
              instructor={instructors[item.id]}
              onPress={() => {
                HapticService.medium();
                router.push({
                  pathname: "/course/[id]",
                  params: { id: item.id.toString() },
                } as any);
              }}
            />
          </View>
        )}
        numColumns={isLandscape ? 2 : 1}
        key={isLandscape ? "landscape" : "portrait"}
        ListHeaderComponent={
          <CoursesHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            recommended={recommended}
            onPressRecommended={(id) =>
              router.push({ pathname: "/course/[id]", params: { id } } as any)
            }
            searchHistory={searchHistory}
            onHistoryPress={(q) => {
              setSearchQuery(q);
              setIsSearchFocused(false);
              HapticService.light();
            }}
            isFocused={isSearchFocused}
            setIsFocused={setIsSearchFocused}
            onSubmit={handleSearchSubmit}
            onClearHistory={clearSearchHistory}
          />
        }
        ListFooterComponent={loading ? renderLoading : null}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
