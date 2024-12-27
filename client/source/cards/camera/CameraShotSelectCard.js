import React from "react";
import { Dimensions, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox"; // Ensure consistent import
import { cardStyles } from "../../../styles";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function CameraShotSelectCard({
  shot,
  isSelected,
  onCheckboxToggle,
}) {
  return (
    <Pressable onPress={() => onCheckboxToggle(shot._id)}>
      <View
        style={[
          cardStyles.cameraShotContainer,
          { marginRight: spacing, marginBottom: spacing },
        ]}
      >
        {/* Shot Image */}
        <Image
          source={{ uri: shot.imageThumbnail }}
          style={cardStyles.shotImage}
        />
        {/* Overlay Border for Selected */}
        {isSelected && <View style={cardStyles.overlayBorder} />}
        {/* Checkbox */}
        {isSelected && (
          <Checkbox
            style={cardStyles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(shot._id)}
            color={isSelected ? "#6AB952" : undefined}
          />
        )}
      </View>
    </Pressable>
  );
}
