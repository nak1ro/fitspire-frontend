// src/ui/design/atoms/StatRow.tsx
import React from "react";
import { View, Text } from "react-native";
import { useDesign, makeLocalStyles } from "../system";

type Props = {
  label?: string;
  labelNode?: React.ReactNode;
  value: string;
};

export function StatRow({ label, labelNode, value }: Props) {
  const d = useDesign();
  const s = makeLocalStyles(d, ({ tokens, radii }) => ({
    row: {
      borderRadius: radii.md,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderWidth: 1,
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: tokens.rowBg,
      borderColor: tokens.rowBorder,
    },
    labelWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
    label: { fontSize: 14, fontWeight: "600", color: tokens.textMuted },
    value: { fontSize: 18, fontWeight: "800", color: tokens.textStrong },
  }));
  return (
    <View style={s.row}>
      <View style={s.labelWrap}>
        {labelNode ?? <Text style={s.label}>{label}</Text>}
      </View>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}
