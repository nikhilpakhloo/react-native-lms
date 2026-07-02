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

type ProductListPayload =
    | Product[]
    | {
        products?: Product[];
        docs?: Product[];
        items?: Product[];
    };

const normalizeProducts = (payload: ProductListPayload): Product[] => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload.products || payload.docs || payload.items || [];
};

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
     * Fetch a product list to populate the course catalog.
     * Falls back to random products only if the list endpoint is unavailable.
     */
    getRandomCourses: async (count: number = 10): Promise<Product[]> => {
        try {
            const response = await apiClient.get<ApiResponse<ProductListPayload> | ProductListPayload>(
                '/public/randomproducts',
                { params: { limit: count } }
            );
            const payload = 'data' in response.data ? response.data.data : response.data;
            const products = normalizeProducts(payload).slice(0, count);

            if (products.length > 0) {
                return products;
            }
        } catch {
            // Fall back to the single random product endpoint below.
        }

        const productMap = new Map<number, Product>();
        const attempts = count * 2;

        for (let index = 0; index < attempts && productMap.size < count; index += 1) {
            const course = await courseApi.getRandomCourse();
            productMap.set(course.id, course);
        }

        return Array.from(productMap.values());
    },

    /**
     * Fetch a random user to use as an instructor
     */
    getRandomInstructor: async (): Promise<RandomUser> => {
        const response = await apiClient.get<ApiResponse<RandomUser>>('/public/randomusers/user/random');
        return response.data.data;
    },
};
