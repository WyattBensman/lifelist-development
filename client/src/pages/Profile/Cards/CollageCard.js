import { Image, StyleSheet } from "react-native";

export default function CollageCard({ width }) {
  return (
    <Image
      source={require("../../../../public/images/jackson-hole-01.png")}
      style={[styles.image, { width: width }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    margin: 1,
  },
});
