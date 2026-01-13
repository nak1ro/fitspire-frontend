/**
 * Flow Design System - Header Component
 * App bar replacement for react-native-paper Appbar
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

export interface HeaderProps {
    title: string;
    leftAction?: React.ReactNode;
    rightActions?: React.ReactNode[];
    transparent?: boolean;
    style?: ViewStyle;
}

export function Header({
    title,
    leftAction,
    rightActions,
    transparent = false,
    style,
}: HeaderProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + theme.spacing[2],
                    paddingHorizontal: theme.spacing[4],
                    paddingBottom: theme.spacing[2],
                    backgroundColor: transparent ? 'transparent' : theme.colors.surface,
                    borderBottomWidth: transparent ? 0 : 1,
                    borderBottomColor: theme.colors.border,
                },
                style,
            ]}
        >
            <View style={styles.leftSection}>
                {leftAction}
            </View>

            <Text variant="heading" weight="bold" style={styles.title}>
                {title}
            </Text>

            <View style={styles.rightSection}>
                {rightActions?.map((action, index) => (
                    <View key={index} style={{ marginLeft: theme.spacing[2] }}>
                        {action}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    title: {
        flex: 2,
        textAlign: 'center',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
