import { Image, StyleSheet } from "react-native";

export default function CameraIcon() {
  return (
    <Image
      source={require("../icons/CameraIcon.png")}
      style={styles.image}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    height: 24,
  },
});
