import React from "react";
import { View, ViewProps } from "react-native";
import { useDesign, makeLocalStyles } from "../system";

type CardProps = ViewProps & {
  variant?: "elevated" | "outlined" | "plain";
  padded?: boolean;
};

export default function Card({ variant = "elevated", padded = true, style, children, ...rest }: CardProps) {
  const d = useDesign();
  const s = makeLocalStyles(d, ({ tokens, radii, shadowCard }) => ({
    base: {
      borderRadius: radii.lg,
      backgroundColor: tokens.card,
      borderWidth: 1,
      borderColor: tokens.cardBorder,
    },
    elevated: shadowCard,
    outlined: {},
    plain: { borderWidth: 0, backgroundColor: "transparent" },
    padded: { padding: 16 },
  }));

  const variantStyle =
    variant === "elevated" ? s.elevated : variant === "outlined" ? s.outlined : s.plain;

  return (
    <View style={[s.base, variantStyle, padded && s.padded, style]} {...rest}>
      {children}
    </View>
  );
}
