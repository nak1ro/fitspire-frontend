/**
 * Flow Design System - Shadow Tokens
 */

import { Platform, ViewStyle } from 'react-native';

export const shadows = {
    sm: Platform.select<ViewStyle>({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
        },
        android: {
            elevation: 2,
        },
    }) ?? {},

    md: Platform.select<ViewStyle>({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
        },
        android: {
            elevation: 4,
        },
    }) ?? {},

    lg: Platform.select<ViewStyle>({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.16,
            shadowRadius: 32,
        },
        android: {
            elevation: 8,
        },
    }) ?? {},
} as const;

export type ShadowKey = keyof typeof shadows;
