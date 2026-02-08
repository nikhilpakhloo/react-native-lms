import { create } from 'zustand';
import { Storage } from '../utils/storage';

/**
 * User interface based on freeapi.app structure
 */
interface User {
    id: string;
    username: string;
    email: string;
    avatar?: {
        url: string;
        localPath?: string;
    };
    role: string;
    // Add other fields as per API response
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: User, token: string, refreshToken: string) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
    setToken: (token: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,

    /**
     * Set authentication state and persist it
     */
    setAuth: async (user, token, refreshToken) => {
        await Storage.saveToken('auth_token', token);
        await Storage.saveToken('refresh_token', refreshToken);
        await Storage.setItem('user_profile', user);
        set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    },

    /**
     * Update user details in state and storage
     */
    updateUser: async (user) => {
        await Storage.setItem('user_profile', user);
        set({ user });
    },

    /**
     * Clear authentication state and storage
     */
    logout: async () => {
        await Storage.removeToken('auth_token');
        await Storage.removeToken('refresh_token');
        await Storage.removeItem('user_profile');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
    },

    /**
     * Initialize state from storage on app startup
     */
    initialize: async () => {
        set({ isLoading: true });
        try {
            const token = await Storage.getToken('auth_token');
            const refreshToken = await Storage.getToken('refresh_token');
            const user = await Storage.getItem('user_profile');


            if (token && user) {
                set({ user, token, refreshToken, isAuthenticated: true });
            } else {
                set({ isAuthenticated: false });
            }
        } catch (error) {
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update tokens only (used by refresh mechanism)
     */
    setToken: async (token, refreshToken) => {
        await Storage.saveToken('auth_token', token);
        await Storage.saveToken('refresh_token', refreshToken);
        set({ token, refreshToken });
    },
}));
