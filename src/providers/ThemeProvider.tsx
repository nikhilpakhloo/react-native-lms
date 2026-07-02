import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { THEME_COLORS } from '../constants/colors';

type AppThemeName = 'light' | 'dark';
type AppTheme = {
    name: AppThemeName;
    isDark: boolean;
    colors: typeof THEME_COLORS.light | typeof THEME_COLORS.dark;
};

const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const systemScheme = useColorScheme();
    const themeName: AppThemeName = systemScheme === 'dark' ? 'dark' : 'light';

    const theme = useMemo<AppTheme>(
        () => ({
            name: themeName,
            isDark: themeName === 'dark',
            colors: THEME_COLORS[themeName],
        }),
        [themeName]
    );

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(theme.colors.background);
    }, [theme.colors.background]);

    return (
        <ThemeContext.Provider value={theme}>
            <StatusBar style={theme.colors.statusBar} />
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const theme = useContext(ThemeContext);

    if (!theme) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }

    return theme;
};
