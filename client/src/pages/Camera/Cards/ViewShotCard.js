import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { BASE_URL } from "../../../utils/config";

export default function ViewShotCard({ imageUrl }) {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: `${BASE_URL}${imageUrl}` }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
