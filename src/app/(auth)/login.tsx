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

import { login } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AUTH_COLORS, AUTH_STYLES, AUTH_TEXT_COLORS } from '../../constants/colors';
import { AUTH_STRINGS } from '../../constants/strings';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginFormData, loginSchema } from '../../utils/validation';

export default function LoginScreen() {
    const router = useRouter();
    const { keyboardHeight, keyboardHeightAnimated } = useKeyboard();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = React.useRef<ScrollView>(null);

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
                return;
            }

            Alert.alert(
                AUTH_STRINGS.alerts.loginFailedTitle,
                response.message || AUTH_STRINGS.alerts.invalidCredentials
            );
        } catch (error: any) {
            Alert.alert(
                AUTH_STRINGS.alerts.loginFailedTitle,
                error.response?.data?.message || AUTH_STRINGS.alerts.loginFailedFallback
            );
        } finally {
            setLoading(false);
        }
    };

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
                    className="items-center pt-14 pb-8 px-6"
                    style={{ backgroundColor: AUTH_COLORS.loginHeaderBackground }}
                >
                    <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-lg mb-4">
                        <Ionicons name="school" size={40} color={AUTH_COLORS.loginIcon} />
                    </View>
                    <Text
                        className={AUTH_STYLES.headerTitle}
                        style={{ color: AUTH_TEXT_COLORS.headerTitle }}
                    >
                        {AUTH_STRINGS.login.title}
                    </Text>
                    <Text
                        className={AUTH_STYLES.headerSubtitle}
                        style={{ color: AUTH_TEXT_COLORS.loginSubtitle }}
                    >
                        {AUTH_STRINGS.login.subtitle}
                    </Text>
                </View>

                <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-[32px] px-6 pt-8 pb-8 shadow-lg">
                    <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {AUTH_STRINGS.login.formTitle}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 mt-1 mb-7">
                        {AUTH_STRINGS.login.formSubtitle}
                    </Text>

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label={AUTH_STRINGS.login.usernameLabel}
                                placeholder={AUTH_STRINGS.login.usernamePlaceholder}
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
                                label={AUTH_STRINGS.login.passwordLabel}
                                placeholder={AUTH_STRINGS.login.passwordPlaceholder}
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
                        title={AUTH_STRINGS.login.submit}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        size="lg"
                        className="mt-5"
                    />

                    <View className="flex-row justify-center items-center mt-7">
                        <Text className={AUTH_STYLES.promptText}>
                            {AUTH_STRINGS.login.switchPrompt}
                        </Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
                            <Text className={AUTH_STYLES.linkText}>
                                {AUTH_STRINGS.login.switchAction}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={{ height: keyboardHeightAnimated }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
