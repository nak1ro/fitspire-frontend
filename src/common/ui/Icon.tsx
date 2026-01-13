/**
 * Flow Design System - Icon Component
 * Lucide icon wrapper with theme support
 */

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { LucideIcon } from 'lucide-react-native';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconColor = 'primary' | 'secondary' | 'inverse' | 'accent' | 'error' | 'success';

export interface IconProps {
    icon: LucideIcon;
    size?: IconSize;
    color?: IconColor | string;
    strokeWidth?: number;
}

export function Icon({
    icon: IconComponent,
    size = 'md',
    color = 'primary',
    strokeWidth = 1.5,
}: IconProps) {
    const theme = useTheme();

    const sizeValue = theme.icon[size];

    const colorMap: Record<IconColor, string> = {
        primary: theme.colors.text.primary,
        secondary: theme.colors.text.secondary,
        inverse: theme.colors.text.inverse,
        accent: theme.colors.primary[500],
        error: theme.colors.error,
        success: theme.colors.success,
    };

    const colorValue = colorMap[color as IconColor] ?? color;

    return (
        <IconComponent
            size={sizeValue}
            color={colorValue}
            strokeWidth={strokeWidth}
        />
    );
}
