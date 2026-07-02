import { Product } from '../api/courses';
import { Storage } from './storage';

const OFFLINE_RESOURCES_KEY = 'offline_lesson_resources';

export interface OfflineLessonResource {
    courseId: number;
    title: string;
    category: string;
    thumbnail?: string;
    savedAt: string;
    lessonCount: number;
    estimatedMinutes: number;
}

export const OfflineResourceService = {
    async getResources() {
        return (await Storage.getItem<OfflineLessonResource[]>(OFFLINE_RESOURCES_KEY)) || [];
    },

    async saveCourseResource(course: Product) {
        const resources = await this.getResources();
        const nextResource: OfflineLessonResource = {
            courseId: course.id,
            title: course.title,
            category: course.category,
            thumbnail: course.thumbnail,
            savedAt: new Date().toISOString(),
            lessonCount: 4,
            estimatedMinutes: 60,
        };
        const nextResources = [
            nextResource,
            ...resources.filter((resource) => resource.courseId !== course.id),
        ];

        await Storage.setItem(OFFLINE_RESOURCES_KEY, nextResources);
        return nextResource;
    },

    async hasResource(courseId: number) {
        const resources = await this.getResources();
        return resources.some((resource) => resource.courseId === courseId);
    },
};
