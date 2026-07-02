import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { AUTH_COLORS, AUTH_STYLES, AUTH_TEXT_COLORS } from '../../constants/colors';
import { AUTH_STRINGS } from '../../constants/strings';
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
                    AUTH_STRINGS.alerts.registrationSuccessTitle,
                    AUTH_STRINGS.alerts.registrationSuccessMessage,
                    [
                        {
                            text: AUTH_STRINGS.alerts.ok,
                            onPress: () => router.replace('/(tabs)/courses'),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    AUTH_STRINGS.alerts.registrationFailedTitle,
                    response.message || AUTH_STRINGS.alerts.registrationFailedShort
                );
            }
        } catch (error: any) {
            Alert.alert(
                AUTH_STRINGS.alerts.registrationFailedTitle,
                error.response?.data?.message || AUTH_STRINGS.alerts.registrationFailedFallback
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
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="items-center pt-12 pb-6 px-6"
                    style={{ backgroundColor: AUTH_COLORS.registerHeaderBackground }}
                >
                    <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-lg mb-4">
                        <Ionicons name="person-add" size={40} color={AUTH_COLORS.registerIcon} />
                    </View>
                    <Text
                        className={AUTH_STYLES.headerTitle}
                        style={{ color: AUTH_TEXT_COLORS.headerTitle }}
                    >
                        {AUTH_STRINGS.register.title}
                    </Text>
                    <Text
                        className={AUTH_STYLES.headerSubtitle}
                        style={{ color: AUTH_TEXT_COLORS.registerSubtitle }}
                    >
                        {AUTH_STRINGS.register.subtitle}
                    </Text>
                </View>

                <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-[32px] px-6 pt-7 pb-8 shadow-lg">
                    <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {AUTH_STRINGS.register.formTitle}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
                        {AUTH_STRINGS.register.formSubtitle}
                    </Text>

                    {/* Username Input */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label={AUTH_STRINGS.register.usernameLabel}
                                placeholder={AUTH_STRINGS.register.usernamePlaceholder}
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
                                label={AUTH_STRINGS.register.emailLabel}
                                placeholder={AUTH_STRINGS.register.emailPlaceholder}
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
                                label={AUTH_STRINGS.register.passwordLabel}
                                placeholder={AUTH_STRINGS.register.passwordPlaceholder}
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
                                label={AUTH_STRINGS.register.confirmPasswordLabel}
                                placeholder={AUTH_STRINGS.register.confirmPasswordPlaceholder}
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
                        title={AUTH_STRINGS.register.submit}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        size="lg"
                        className="mt-5"
                    />

                    <View className="flex-row justify-center items-center mt-7 mb-8">
                        <Text className={AUTH_STYLES.promptText}>
                            {AUTH_STRINGS.register.switchPrompt}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/login')}
                        >
                            <Text className={AUTH_STYLES.linkText}>
                                {AUTH_STRINGS.register.switchAction}
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
