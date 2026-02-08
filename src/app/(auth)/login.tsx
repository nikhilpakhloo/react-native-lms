import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginFormData, loginSchema } from '../../utils/validation';

export default function LoginScreen() {
    const router = useRouter();
    const { keyboardHeight, keyboardHeightAnimated } = useKeyboard();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await login(data);

            if (response.success && response.data) {
                const user = {
                    id: response.data.user._id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    avatar: response.data.user.avatar,
                    role: response.data.user.role,
                };

                await setAuth(user, response.data.accessToken, response.data.refreshToken);
                router.replace('/(tabs)/courses');
            } else {
                Alert.alert('Login Failed', response.message || 'Invalid credentials');
            }
        } catch (error: any) {
            Alert.alert(
                'Login Failed',
                error.response?.data?.message || 'Unable to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const scrollViewRef = React.useRef<ScrollView>(null);

    // Auto-scroll when keyboard opens
    React.useEffect(() => {
        if (keyboardHeight > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [keyboardHeight]);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
                className="absolute top-0 left-0 right-0 h-64"
            />

            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="items-center pt-16 pb-8">
                    <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg mb-4">
                        <Ionicons name="school" size={40} color="#3B82F6" />
                    </View>
                    <Text className="text-3xl font-bold text-white mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-blue-100 text-base">
                        Sign in to continue learning
                    </Text>
                </View>

                {/* Form Container */}
                <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-8">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Login
                    </Text>

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Username"
                                placeholder="Enter your username"
                                icon="person"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.username?.message}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                icon="lock-closed"
                                isPassword
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title="Login"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        size="lg"
                        className="mt-4"
                    />

                    <View className="flex-row justify-center items-center mt-6">
                        <Text className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/register')}
                        >
                            <Text className="text-blue-500 font-bold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Smooth Animated Spacer */}
                    <Animated.View style={{ height: keyboardHeightAnimated }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
