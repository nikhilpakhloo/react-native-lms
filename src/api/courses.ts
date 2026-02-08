import apiClient from './client';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface RandomUser {
    id: number; // User ID from the snippet (e.g., 409)
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: {
        street: {
            number: number;
            name: string;
        };
        city: string;
        state: string;
        country: string;
        postcode: number | string;
        coordinates?: {
            latitude: string;
            longitude: string;
        };
        timezone?: {
            offset: string;
            description: string;
        };
    };
    email: string;
    login: {
        uuid: string;
        username: string;
    };
    dob: {
        date: string;
        age: number;
    };
    registered: {
        date: string;
        age: number;
    };
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    phone: string;
    cell: string;
    nat: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

/**
 * Course/Product API Service
 */
export const courseApi = {
    /**
     * Fetch a random product to use as a course
     */
    getRandomCourse: async (): Promise<Product> => {
        const response = await apiClient.get<ApiResponse<Product>>('/public/randomproducts/product/random');
        return response.data.data;
    },

    /**
     * Fetch multiple random products to populate the course list
     * Since the API only returns one random product at a time for this specific endpoint,
     * we might need to call it multiple times or use a different endpoint for lists.
     * For now, following the specific endpoint provided by the user.
     */
    getRandomCourses: async (count: number = 10): Promise<Product[]> => {
        const promises = Array.from({ length: count }, () => courseApi.getRandomCourse());
        return Promise.all(promises);
    },

    /**
     * Fetch a random user to use as an instructor
     */
    getRandomInstructor: async (): Promise<RandomUser> => {
        const response = await apiClient.get<ApiResponse<RandomUser>>('/public/randomusers/user/random');
        return response.data.data;
    },
};
