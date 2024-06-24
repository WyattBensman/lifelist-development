import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import { Checkbox } from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function ShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
  navigation,
  index,
}) {
  const imageUrl = `${BASE_URL}${shot.image}`;

  return (
    <Pressable
      onPress={() => navigation.navigate("ViewShot", { shotId: shot._id })}
      style={[
        styles.container,
        {
          marginRight: (index + 1) % 3 === 0 ? 0 : spacing, // Remove marginRight for the last item in each row
        },
      ]}
    >
      <View style={styles.shotContainer}>
        <Image source={{ uri: imageUrl }} style={styles.shotImage} />
        {isSelected !== undefined && onCheckboxToggle && (
          <Checkbox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(shot._id)}
            color={isSelected ? "#6AB952" : "#d4d4d4"}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
  },
  shotContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  shotImage: {
    width: "100%",
    height: "100%",
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
});
