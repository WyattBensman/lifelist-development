import { Image, StyleSheet } from "react-native";

export default function CameraIcon() {
  return (
    <Image
      source={require("./CameraIcon.png")}
      style={styles.image}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    height: 23,
    width: 75,
    marginBottom: 10,
  },
});
