import React from "react";
import ButtonIcon from "./ButtonIcon";

export default function CollageButtonIcon({
  name,
  style,
  weight = "bold",
  tintColor = "#fff",
  onPress,
}) {
  return (
    <ButtonIcon
      name={name}
      style={style}
      weight={weight}
      tintColor={tintColor}
      onPress={onPress}
      backgroundColor={"rgba(38, 40, 40, 0.25)"}
      size="large"
    />
  );
}
