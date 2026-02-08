import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage utility to handle both sensitive and non-sensitive data.
 * SecureStore is used for tokens, while AsyncStorage is used for app data.
 */
export const Storage = {
    // For sensitive data (e.g., JWT Tokens)
    async saveToken(key: string, value: string) {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
        }
    },

    async getToken(key: string) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            return null;
        }
    },

    async removeToken(key: string) {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
        }
    },

    // For general app data (e.g., user preferences, bookmarks)
    async setItem(key: string, value: any) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
        }
    },

    async getItem(key: string) {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            return null;
        }
    },

    async removeItem(key: string) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
        }
    },
};
