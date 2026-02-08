import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Animated, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export const OfflineBanner = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [animation] = useState(new Animated.Value(-100)); // Start off-screen (top)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);

            if (state.isConnected === false) {
                // Show banner
                Animated.spring(animation, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 20,
                    friction: 7
                }).start();
            } else {
                // Hide banner after a small delay
                setTimeout(() => {
                    Animated.timing(animation, {
                        toValue: -150,
                        duration: 500,
                        useNativeDriver: true
                    }).start();
                }, 1500);
            }
        });

        return () => unsubscribe();
    }, []);

    if (isConnected === null) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: animation }],
                    backgroundColor: isConnected ? '#10B981' : '#EF4444' // Emerald-500 or Red-500
                }
            ]}
        >
            <SafeAreaView>
                <View className="flex-row items-center justify-center py-3 px-4">
                    <Ionicons
                        name={isConnected ? "checkmark-circle" : "cloud-offline"}
                        size={20}
                        color="white"
                    />
                    <Text className="text-white font-bold ml-2">
                        {isConnected ? "Back Online" : "No Internet Connection"}
                    </Text>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    }
});
