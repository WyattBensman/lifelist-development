import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import { BASE_URL } from "../../../utils/config";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function NavigableShotCard({ shot, navigation }) {
  const imageUrl = `${BASE_URL}${shot.image}`;

  return (
    <Pressable
      onPress={() => navigation.navigate("ViewShot", { imageUrl: shot.image })}
    >
      <View style={styles.container}>
        <View style={styles.shotContainer}>
          <Image source={{ uri: imageUrl }} style={styles.shotImage} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: shotWidth,
    height: shotHeight,
    marginRight: spacing,
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
});
