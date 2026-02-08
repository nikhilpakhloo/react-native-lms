import { z } from 'zod';

/**
 * Validation schemas for authentication forms
 */

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, or underscores'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters'),
});

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, or underscores')
        .transform(val => val.toLowerCase()),
    email: z
        .email('Please enter a valid email address')
        .transform(val => val.toLowerCase()),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
