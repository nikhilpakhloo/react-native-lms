import apiClient from './client';

/**
 * Auth API Service
 * Handles all authentication-related API calls to freeapi.app
 */

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    statusCode: number;
    data: {
        user: {
            _id: string;
            username: string;
            email: string;
            avatar?: {
                url: string;
                localPath?: string;
            };
            role: string;
            isEmailVerified: boolean;
            createdAt: string;
            updatedAt: string;
        };
        accessToken: string;
        refreshToken: string;
    };
    message: string;
    success: boolean;
}

export interface RefreshTokenResponse {
    statusCode: number;
    data: {
        accessToken: string;
        refreshToken: string;
    };
    message: string;
    success: boolean;
}

export interface UserProfileResponse {
    statusCode: number;
    data: {
        _id: string;
        username: string;
        email: string;
        avatar?: {
            url: string;
            localPath?: string;
        };
        role: string;
        isEmailVerified: boolean;
        createdAt: string;
        updatedAt: string;
    };
    message: string;
    success: boolean;
}

/**
 * Login user with username/email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/login', credentials);
    return response.data;
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/register', data);
    return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/users/current-user');
    return response.data;
};

/**
 * Logout user (if backend supports it)
 */
export const logout = async (): Promise<void> => {
    try {
        await apiClient.post('/users/logout');
    } catch (error) {
        // Even if API fails, we'll clear local state
    }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/users/refresh-token', {
        refreshToken,
    });
    return response.data;
};

/**
 * Update user avatar
 */
export const updateAvatar = async (imageUri: string): Promise<UserProfileResponse> => {
    const formData = new FormData();
    formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
    } as any);

    const response = await apiClient.patch<UserProfileResponse>(
        '/users/avatar',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};
