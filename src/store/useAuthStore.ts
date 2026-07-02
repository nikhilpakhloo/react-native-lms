import { create } from 'zustand';
import { Storage } from '../utils/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.freeapi.app/api/v1';
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_PROFILE_KEY = 'user_profile';

/**
 * User interface based on freeapi.app structure
 */
export interface User {
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

interface ApiUser {
    _id: string;
    username: string;
    email: string;
    avatar?: User['avatar'];
    role: string;
}

interface CurrentUserResponse {
    success: boolean;
    data: ApiUser;
}

interface RefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
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

const normalizeUser = (user: ApiUser): User => ({
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
});

const fetchCurrentUser = async (token: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return null;
    }

    const payload = (await response.json()) as CurrentUserResponse;
    return payload.success && payload.data ? normalizeUser(payload.data) : null;
};

const refreshSession = async (refreshToken: string): Promise<{ token: string; refreshToken: string } | null> => {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        return null;
    }

    const payload = (await response.json()) as RefreshTokenResponse;
    if (!payload.success || !payload.data) {
        return null;
    }

    return {
        token: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
    };
};

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
        await Storage.saveToken(AUTH_TOKEN_KEY, token);
        await Storage.saveToken(REFRESH_TOKEN_KEY, refreshToken);
        await Storage.setItem(USER_PROFILE_KEY, user);
        set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    },

    /**
     * Update user details in state and storage
     */
    updateUser: async (user) => {
        await Storage.setItem(USER_PROFILE_KEY, user);
        set({ user });
    },

    /**
     * Clear authentication state and storage
     */
    logout: async () => {
        await Storage.removeToken(AUTH_TOKEN_KEY);
        await Storage.removeToken(REFRESH_TOKEN_KEY);
        await Storage.removeItem(USER_PROFILE_KEY);
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
    },

    /**
     * Initialize state from storage on app startup
     */
    initialize: async () => {
        set({ isLoading: true });
        try {
            const token = await Storage.getToken(AUTH_TOKEN_KEY);
            const refreshToken = await Storage.getToken(REFRESH_TOKEN_KEY);
            const cachedUser = await Storage.getItem<User>(USER_PROFILE_KEY);

            if (!token || !cachedUser) {
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
                return;
            }

            const validatedUser = await fetchCurrentUser(token);

            if (validatedUser) {
                await Storage.setItem(USER_PROFILE_KEY, validatedUser);
                set({ user: validatedUser, token, refreshToken, isAuthenticated: true });
                return;
            }

            if (refreshToken) {
                const refreshedSession = await refreshSession(refreshToken);

                if (refreshedSession) {
                    const refreshedUser = await fetchCurrentUser(refreshedSession.token);

                    if (refreshedUser) {
                        await Storage.saveToken(AUTH_TOKEN_KEY, refreshedSession.token);
                        await Storage.saveToken(REFRESH_TOKEN_KEY, refreshedSession.refreshToken);
                        await Storage.setItem(USER_PROFILE_KEY, refreshedUser);
                        set({
                            user: refreshedUser,
                            token: refreshedSession.token,
                            refreshToken: refreshedSession.refreshToken,
                            isAuthenticated: true,
                        });
                        return;
                    }
                }
            }

            await Storage.removeToken(AUTH_TOKEN_KEY);
            await Storage.removeToken(REFRESH_TOKEN_KEY);
            await Storage.removeItem(USER_PROFILE_KEY);
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        } catch {
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update tokens only (used by refresh mechanism)
     */
    setToken: async (token, refreshToken) => {
        await Storage.saveToken(AUTH_TOKEN_KEY, token);
        await Storage.saveToken(REFRESH_TOKEN_KEY, refreshToken);
        set({ token, refreshToken });
    },
}));
