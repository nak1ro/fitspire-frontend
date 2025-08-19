import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { useDesign, makeLocalStyles } from "../system";

type BtnProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  variant?: "primary" | "ghost";
  full?: boolean;
};

export function Button({ title, onPress, disabled, loading, style, variant = "primary", full }: BtnProps) {
  const d = useDesign();
  const s = makeLocalStyles(d, ({ tokens, radii }) => ({
    base: {
      borderRadius: radii.md,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      flexGrow: full ? 1 : 0,
    },
    primary: { backgroundColor: tokens.primary },
    primaryText: { color: tokens.onPrimary, fontWeight: "800", fontSize: 16 },
    ghost: { borderWidth: 1, borderColor: tokens.cardBorder, backgroundColor: tokens.ghostBg },
    ghostText: { color: tokens.textMuted, fontWeight: "800", fontSize: 16 },
    disabled: { opacity: 0.6 },
  }));

  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.base,
        isPrimary ? s.primary : s.ghost,
        (disabled || loading) && s.disabled,
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : undefined} />
      ) : (
        <Text style={isPrimary ? s.primaryText : s.ghostText}>{title}</Text>
      )}
    </Pressable>
  );
}
