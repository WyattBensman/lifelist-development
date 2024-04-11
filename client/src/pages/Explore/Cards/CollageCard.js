import { Image, StyleSheet } from "react-native";

export default function CollageCard({ width }) {
  return (
    <Image
      source={require("../../../../public/images/wyattbensman.png")}
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
