import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import { Checkbox } from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const shotWidth = width / 3;
const shotHeight = (shotWidth * 3) / 2;

const baseURL = "http://localhost:3001";

export default function ShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
  navigation,
}) {
  const imageUrl = `${baseURL}${shot.image}`;

  return (
    <Pressable
      onPress={() => navigation.navigate("ViewShot", { imageUrl: shot.image })}
    >
      <View style={styles.shotContainer}>
        <Image source={{ uri: imageUrl }} style={styles.shotImage} />
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
    marginBottom: 10,
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
    borderColor: "#d4d4d4",
  },
});
