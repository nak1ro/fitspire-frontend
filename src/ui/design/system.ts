import { Platform, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { AppTheme, Tokens } from "../theme/theme";

export type Design = {
  theme: AppTheme;
  tokens: Tokens;
  spacing: (n: number) => number;
  radii: { sm: number; md: number; lg: number; pill: number };
  // helpers
  shadowCard: ViewStyle;
  hairline: ViewStyle;
  pressable(scale?: number): ViewStyle[];
};

export function useDesign(): Design {
  const { theme, tokens, spacing, radii } = useTheme();

  const shadowCard: ViewStyle =
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }
      : { elevation: 2 };

  const hairline: ViewStyle = { borderWidth: StyleSheet.hairlineWidth, borderColor: tokens.divider };

  const pressable = (scale = 0.98) => [{ transform: [{ scale }] }];

  return { theme, tokens, spacing, radii, shadowCard, hairline, pressable };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
): T {
  throw new Error("Use makeLocalStyles(design) at runtime. This helper is type-only.");
}

export function makeLocalStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  d: Design,
  builder: (d: Design) => T
): T {
  return StyleSheet.create(builder(d));
}
