import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";

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
  const imageUrl = `${BASE_URL}${shot.image}`;

  return (
    <Pressable onPress={() => onCheckboxToggle(shot._id)}>
      <View style={styles.shotContainer}>
        <Image source={{ uri: imageUrl }} style={styles.shotImage} />
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
