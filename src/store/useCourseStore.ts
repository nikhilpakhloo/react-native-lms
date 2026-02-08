import { create } from 'zustand';
import { Product, RandomUser, courseApi } from '../api/courses';
import { HapticService } from '../utils/haptics';
import { NotificationService } from '../utils/notifications';
import { Storage } from '../utils/storage';

interface CourseState {
    courses: Product[];
    instructors: Record<number, RandomUser>; // productId -> RandomUser
    loading: boolean;
    error: string | null;
    bookmarks: number[]; // Array of product IDs
    enrolled: number[]; // Array of product IDs
    recommended: Product[]; // Recommended courses
    progress: Record<number, number>; // productId -> percentage (0-100)
    searchHistory: string[]; // Recent searches

    // Actions
    fetchCourses: (count?: number) => Promise<void>;
    toggleBookmark: (productId: number) => void;
    enrollCourse: (productId: number) => void;
    updateProgress: (productId: number, percent: number) => void;
    addSearchQuery: (query: string) => void;
    clearSearchHistory: () => void;
    getRecommendations: () => void;
    clearError: () => void;
    initialize: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],
    instructors: {},
    loading: false,
    error: null,
    bookmarks: [],
    enrolled: [],
    recommended: [],
    progress: {},
    searchHistory: [],

    initialize: async () => {
        try {
            const [bookmarks, enrolled, progress, searchHistory] = await Promise.all([
                Storage.getItem('bookmarks'),
                Storage.getItem('enrolled'),
                Storage.getItem('progress'),
                Storage.getItem('search_history')
            ]);

            if (bookmarks) set({ bookmarks });
            if (enrolled) set({ enrolled });
            if (progress) set({ progress });
            if (searchHistory) set({ searchHistory });

            get().getRecommendations();

        } catch (error) {
        }
    },

    fetchCourses: async (count = 10) => {
        set({ loading: true, error: null });
        try {
            const fetchedCourses = await courseApi.getRandomCourses(count);

            const instructorPromises = fetchedCourses.map(async (course) => {
                try {
                    const instructor = await courseApi.getRandomInstructor();
                    return { productId: course.id, instructor };
                } catch (err) {
                    return { productId: course.id, instructor: null };
                }
            });

            const instructorsResults = await Promise.all(instructorPromises);
            const instructorsMap: Record<number, RandomUser> = {};

            instructorsResults.forEach(({ productId, instructor }) => {
                if (instructor) {
                    instructorsMap[productId] = instructor;
                }
            });

            set({
                courses: fetchedCourses,
                instructors: instructorsMap,
                loading: false
            });

            get().getRecommendations();

        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch courses', loading: false });
        }
    },

    toggleBookmark: (productId: number) => {
        const state = get();
        const isBookmarked = state.bookmarks.includes(productId);
        const nextBookmarks = isBookmarked
            ? state.bookmarks.filter(id => id !== productId)
            : [...state.bookmarks, productId];

        set({ bookmarks: nextBookmarks });
        Storage.setItem('bookmarks', nextBookmarks);

        state.getRecommendations();

        // Assignment Requirement: Notification when user bookmarks 5+ courses
        if (!isBookmarked && nextBookmarks.length === 5) {
            NotificationService.sendLocalNotification(
                "Learning Milestone! 🏆",
                "You've bookmarked 5 courses! Ready to start your learning journey?"
            );
        }

        // Haptics & Notification
        if (!isBookmarked) {
            HapticService.light();
            const course = state.courses.find(c => c.id === productId);
            NotificationService.sendLocalNotification(
                "Course Bookmarked! 📌",
                `We've saved "${course?.title || 'this course'}" to your bookmarks.`
            );
        } else {
            HapticService.light();
        }
    },

    enrollCourse: (productId: number) => {
        const state = get();
        if (state.enrolled.includes(productId)) return;

        const nextEnrolled = [...state.enrolled, productId];
        const nextProgress = { ...state.progress, [productId]: 0 };

        set({
            enrolled: nextEnrolled,
            progress: nextProgress
        });

        Storage.setItem('enrolled', nextEnrolled);
        Storage.setItem('progress', nextProgress);

        state.getRecommendations();
        HapticService.success();
    },

    updateProgress: (productId: number, percent: number) => {
        set((state) => {
            const nextProgress = { ...state.progress, [productId]: percent };
            Storage.setItem('progress', nextProgress);

            if (percent === 100) {
                HapticService.success();
            } else {
                HapticService.medium();
            }

            return { progress: nextProgress };
        });
    },

    addSearchQuery: (query: string) => {
        if (!query.trim()) return;

        set((state) => {
            const filteredHistory = state.searchHistory.filter(q => q !== query);
            const nextHistory = [query, ...filteredHistory].slice(0, 10); // Keep last 10
            Storage.setItem('search_history', nextHistory);
            return { searchHistory: nextHistory };
        });
    },

    clearSearchHistory: () => {
        set({ searchHistory: [] });
        Storage.setItem('search_history', []);
    },

    getRecommendations: () => {
        const { courses, bookmarks, enrolled } = get();
        if (courses.length === 0) return;

        // "AI" Logic: Find categories the user seems interested in
        const interestedCourseIds = [...bookmarks, ...enrolled];
        const interestedCategories = courses
            .filter(c => interestedCourseIds.includes(c.id))
            .map(c => c.category);

        // If no interest yet, just pick 4 random popular ones
        if (interestedCategories.length === 0) {
            set({ recommended: courses.slice(0, 4) });
            return;
        }

        // Recommend courses in the same categories that haven't been enrolled/bookmarked
        const suggestions = courses
            .filter(c =>
                interestedCategories.includes(c.category) &&
                !interestedCourseIds.includes(c.id)
            )
            .slice(0, 4);

        // Fallback to general list if not enough category matches
        set({ recommended: suggestions.length > 0 ? suggestions : courses.slice(0, 4) });
    },


    clearError: () => set({ error: null }),
}));
