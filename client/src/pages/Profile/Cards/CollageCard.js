import { Image, StyleSheet, View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;
const baseURL = "http://localhost:3001";

export default function CollageCard({ path }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${baseURL}${path}` }}
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
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
