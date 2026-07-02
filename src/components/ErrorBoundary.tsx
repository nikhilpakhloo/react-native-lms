import { Ionicons } from '@expo/vector-icons';
import React, { PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';

interface ErrorBoundaryProps extends PropsWithChildren {
    resetKey?: string;
    title?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidUpdate(previousProps: ErrorBoundaryProps) {
        if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-8">
                <View className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 items-center justify-center mb-5">
                    <Ionicons name="warning-outline" size={34} color="#EF4444" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    {this.props.title || 'Something went wrong'}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center mt-3 mb-8 leading-6">
                    This screen hit an unexpected state. You can retry without restarting the app.
                </Text>
                <Pressable
                    onPress={() => this.setState({ hasError: false })}
                    className="bg-blue-600 px-7 py-4 rounded-2xl"
                >
                    <Text className="text-white font-bold">Try Again</Text>
                </Pressable>
            </View>
        );
    }
}
