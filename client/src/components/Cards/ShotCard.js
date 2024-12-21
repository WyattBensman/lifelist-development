import { Dimensions, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const shotWidth = (screenWidth - spacing * 2) / 3; // Adjust for 3 columns
const shotHeight = (shotWidth * 3) / 2; // 2:3 ratio

export default function ShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
  navigation,
}) {
  console.log(shot);

  const imageUrl = shot.imageThumbnail;

  const handlePress = () => {
    if (isSelected !== undefined && onCheckboxToggle) {
      onCheckboxToggle(shot._id);
    } else {
      navigation.navigate("ViewShot", { imageUrl: shot.image });
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.shotContainer}>
        <Image source={{ uri: imageUrl }} style={styles.shotImage} />
        {/* Overlay border */}
        {isSelected && <View style={styles.overlayBorder} />}
        {/* Checkbox */}
        {isSelected !== undefined && onCheckboxToggle && (
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
