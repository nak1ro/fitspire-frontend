/**
 * Flow Design System - useTheme Hook
 */

import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';
import { animations } from '../theme/animations';
import { iconSizes } from '../theme/icons';

export type FlowTheme = {
    scheme: 'light' | 'dark';
    colors: typeof lightTheme.colors;
    glass: typeof lightTheme.glass;
    spacing: typeof spacing;
    typography: typeof typography;
    radius: typeof radius;
    shadows: typeof shadows;
    animations: typeof animations;
    icon: typeof iconSizes;
};

export function useTheme(): FlowTheme {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    return {
        scheme: theme.scheme,
        colors: theme.colors,
        glass: theme.glass,
        spacing,
        typography,
        radius,
        shadows,
        animations,
        icon: iconSizes,
    };
}
