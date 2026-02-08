import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * Custom hook to track keyboard state and height.
 * Provides both state and animated values for smooth UI transitions.
 */
export const useKeyboard = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const onKeyboardShow = (e: KeyboardEvent) => {
            const height = e.endCoordinates.height;
            setKeyboardHeight(height);
            setKeyboardVisible(true);

            Animated.timing(animatedHeight, {
                toValue: height,
                duration: Platform.OS === 'ios' ? e.duration : 250,
                useNativeDriver: false,
            }).start();
        };

        const onKeyboardHide = (e: KeyboardEvent | any) => {
            setKeyboardHeight(0);
            setKeyboardVisible(false);

            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: Platform.OS === 'ios' ? (e?.duration || 250) : 250,
                useNativeDriver: false,
            }).start();
        };

        const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
        const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return {
        keyboardHeight,
        keyboardHeightAnimated: animatedHeight,
        isKeyboardVisible,
        dismissKeyboard: Keyboard.dismiss,
    };
};
