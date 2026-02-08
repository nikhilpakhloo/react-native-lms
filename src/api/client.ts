import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { refreshToken as refreshAuthToken } from './auth';

// Base API URL from environment variables
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.freeapi.app/api/v1';

/**
 * Robust Axios client with interceptors for token injection,
 * retry logic, and global error handling.
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Injects JWT token if available
apiClient.interceptors.request.use(
    async (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handles common error codes and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (Token expired or invalid)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = useAuthStore.getState().refreshToken;

            if (refreshToken) {
                try {
                    const refreshResponse = await refreshAuthToken(refreshToken);

                    if (refreshResponse.success) {
                        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                        // Update storage and state
                        await useAuthStore.getState().setToken(accessToken, newRefreshToken);

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return apiClient(originalRequest);
                    }
                } catch (refreshError) {
                    await useAuthStore.getState().logout();
                }
            } else {
                await useAuthStore.getState().logout();
            }
        }

        // Standard retry logic for 5xx or Network failures
        if (
            (error.response?.status >= 500 || error.code === 'ECONNABORTED' || !error.response) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            // Retrying request...
            return apiClient(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
