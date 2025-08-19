import React from "react";
import { View, Text, ViewProps } from "react-native";
import { useDesign, makeLocalStyles } from "../system";

export default function ValuePill({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  const d = useDesign();
  const s = makeLocalStyles(d, ({ tokens, radii }) => ({
    wrap: {
      borderRadius: radii.pill,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: tokens.pillBorder,
      backgroundColor: tokens.pillBg,
    },
    text: { fontSize: 13, fontWeight: "800", color: tokens.pillText },
  }));
  return (
    <View style={[s.wrap, style]} {...rest}>
      <Text style={s.text}>{children}</Text>
    </View>
  );
}
