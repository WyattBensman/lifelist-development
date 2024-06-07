import { Image, StyleSheet, View, Dimensions } from "react-native";
import { BASE_URL } from "../../../utils/config";

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const imageWidth = (screenWidth - spacing * 2) / 3; // Adjusted to account for the spacing

export default function CollageCard({ path }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${BASE_URL}${path}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageWidth,
    marginRight: spacing,
    marginBottom: spacing,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
