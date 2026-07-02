export const COLORS = {
    white: '#FFFFFF',
    blueSoft: '#DBEAFE',
    purpleSoft: '#EDE9FE',
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    slateDark: '#0F172A',
    disabledStart: '#9CA3AF',
    disabledEnd: '#6B7280',
    registerStart: '#7C3AED',
    registerMid: '#4F46E5',
    registerIcon: '#8B5CF6',
} as const;

export const BUTTON_COLORS = {
    primaryGradient: [COLORS.primary, COLORS.primaryDark] as [string, string],
    disabledGradient: [COLORS.disabledStart, COLORS.disabledEnd] as [string, string],
    spinnerOnPrimary: COLORS.white,
    spinnerOnLight: COLORS.primary,
} as const;

export const BUTTON_STYLES = {
    outlineBorder: 'border-blue-500',
    outlineText: 'text-blue-500',
} as const;

export const AUTH_COLORS = {
    loginHeaderBackground: COLORS.primaryDark,
    registerHeaderBackground: COLORS.registerMid,
    loginIcon: COLORS.primary,
    registerIcon: COLORS.registerIcon,
} as const;

export const AUTH_STYLES = {
    linkText: 'text-blue-600 dark:text-blue-400 font-bold',
    promptText: 'text-gray-600 dark:text-gray-400',
    headerTitle: 'text-3xl font-extrabold mb-2 text-center',
    headerSubtitle: 'text-base text-center',
} as const;

export const AUTH_TEXT_COLORS = {
    headerTitle: COLORS.white,
    loginSubtitle: COLORS.blueSoft,
    registerSubtitle: COLORS.purpleSoft,
} as const;

export const THEME_COLORS = {
    light: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#111827',
        mutedText: '#6B7280',
        border: '#E5E7EB',
        inputBackground: '#FFFFFF',
        placeholder: '#9CA3AF',
        iconMuted: '#9CA3AF',
        statusBar: 'dark' as const,
    },
    dark: {
        background: '#030712',
        surface: '#111827',
        text: '#F9FAFB',
        mutedText: '#9CA3AF',
        border: '#374151',
        inputBackground: '#1F2937',
        placeholder: '#9CA3AF',
        iconMuted: '#9CA3AF',
        statusBar: 'light' as const,
    },
} as const;
