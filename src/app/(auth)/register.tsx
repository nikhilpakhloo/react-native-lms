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

import { register } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { RegisterFormData, registerSchema } from '../../utils/validation';

import { useKeyboard } from '../../hooks/useKeyboard';

export default function RegisterScreen() {
    const router = useRouter();
    const { keyboardHeight, keyboardHeightAnimated } = useKeyboard();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = data;

            const response = await register(registerData);

            if (response.success && response.data) {
                // Transform API response to match our User interface
                const user = {
                    id: response.data.user._id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    avatar: response.data.user.avatar,
                    role: response.data.user.role,
                };

                await setAuth(user, response.data.accessToken, response.data.refreshToken);

                Alert.alert(
                    'Success!',
                    'Your account has been created successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/(tabs)/courses'),
                        },
                    ]
                );
            } else {
                Alert.alert('Registration Failed', response.message || 'Unable to create account');
            }
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error.response?.data?.message || 'Unable to create account. Please try again.'
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
                colors={['#8B5CF6', '#6D28D9', '#5B21B6']}
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
                        <Ionicons name="person-add" size={40} color="#8B5CF6" />
                    </View>
                    <Text className="text-3xl font-bold text-white mb-2">
                        Create Account
                    </Text>
                    <Text className="text-purple-100 text-base">
                        Start your learning journey today
                    </Text>
                </View>

                {/* Form Container */}
                <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-8">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Sign Up
                    </Text>

                    {/* Username Input */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Username"
                                placeholder="Choose a username"
                                icon="person"
                                value={value}
                                onChangeText={(text) => onChange(text.toLowerCase())}
                                onBlur={onBlur}
                                error={errors.username?.message}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        )}
                    />

                    {/* Email Input */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                icon="mail"
                                value={value}
                                onChangeText={(text) => onChange(text.toLowerCase())}
                                onBlur={onBlur}
                                error={errors.email?.message}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        )}
                    />

                    {/* Password Input */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                placeholder="Create a password"
                                icon="lock-closed"
                                isPassword
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.password?.message}
                            />
                        )}
                    />

                    {/* Confirm Password Input */}
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                icon="lock-closed"
                                isPassword
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.confirmPassword?.message}
                            />
                        )}
                    />

                    {/* Register Button */}
                    <Button
                        title="Create Account"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        size="lg"
                        className="mt-4"
                    />

                    {/* Login Link */}
                    <View className="flex-row justify-center items-center mt-6 mb-8">
                        <Text className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text className="text-purple-500 font-bold">
                                Login
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
