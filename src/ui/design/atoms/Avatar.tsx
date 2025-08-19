import React from "react";
import { Image, ImageProps } from "react-native";
import { useDesign } from "../system";

type Props = Omit<ImageProps, "style"> & { size?: number; rounded?: number };

export default function Avatar({ size = 52, rounded, ...rest }: Props) {
  const { radii } = useDesign();
  return (
    <Image
      {...rest}
      style={{
        width: size,
        height: size,
        borderRadius: rounded ?? radii.md,
        backgroundColor: "#ddd",
      }}
    />
  );
}
