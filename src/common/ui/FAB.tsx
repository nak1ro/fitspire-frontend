/**
 * Flow Design System - FAB (Floating Action Button) Component
 */

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Modal,
    Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { Plus, X } from 'lucide-react-native';

type FABAction = {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
};

export interface FABProps {
    icon?: React.ReactNode;
    onPress?: () => void;
    actions?: FABAction[];
    position?: 'bottom-right' | 'bottom-left';
}

export function FAB({
    icon,
    onPress,
    actions,
    position = 'bottom-right',
}: FABProps) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const hasActions = actions && actions.length > 0;

    const handlePress = () => {
        if (hasActions) {
            setOpen(!open);
        } else if (onPress) {
            onPress();
        }
    };

    const handleActionPress = (action: FABAction) => {
        setOpen(false);
        action.onPress();
    };

    const positionStyle = position === 'bottom-right'
        ? { right: 16, bottom: 16 }
        : { left: 16, bottom: 16 };

    return (
        <>
            {/* Backdrop when open */}
            {open && (
                <Pressable
                    style={styles.backdrop}
                    onPress={() => setOpen(false)}
                />
            )}

            <View style={[styles.container, positionStyle]}>
                {/* Action buttons */}
                {open && hasActions && (
                    <View style={styles.actionsContainer}>
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.actionRow,
                                    { marginBottom: theme.spacing[3] },
                                ]}
                                onPress={() => handleActionPress(action)}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={[
                                        styles.actionLabel,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            ...theme.shadows.md,
                                        },
                                    ]}
                                >
                                    <Text variant="label" weight="medium">
                                        {action.label}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.miniFab,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            ...theme.shadows.md,
                                        },
                                    ]}
                                >
                                    {action.icon}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Main FAB */}
                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            backgroundColor: theme.colors.primary[500],
                            ...theme.shadows.lg,
                        },
                    ]}
                    onPress={handlePress}
                    activeOpacity={0.8}
                >
                    {open ? (
                        <X size={24} color={theme.colors.text.inverse} />
                    ) : (
                        icon || <Plus size={24} color={theme.colors.text.inverse} />
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsContainer: {
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionLabel: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    miniFab: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
