import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import { Checkbox } from "expo-checkbox";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function SelectableShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
}) {
  return (
    <Pressable onPress={() => onCheckboxToggle(shot._id)}>
      <View style={styles.shotContainer}>
        <Image source={{ uri: shot.imageThumbnail }} style={styles.shotImage} />
        {/* Overlay border */}
        {isSelected && <View style={styles.overlayBorder} />}
        {/* Checkbox */}
        {isSelected && (
          <Checkbox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(shot._id)}
            color={isSelected ? "#6AB952" : undefined}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shotContainer: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
    marginRight: spacing,
    position: "relative",
  },
  shotImage: {
    width: "100%",
    height: "100%",
  },
  overlayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#6AB952", // Green border color
  },
  checkbox: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 12,
  },
});
