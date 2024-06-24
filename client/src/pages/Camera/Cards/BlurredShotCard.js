import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { BASE_URL } from "../../../utils/config";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const imageWidth = (width - spacing * 2) / 2; // Adjusted to account for the spacing
const imageHeight = (imageWidth * 3) / 2;

export default function BlurredShotCard({ shot }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${BASE_URL}${shot.image}` }}
          style={styles.image}
        />
        <BlurView intensity={8} style={styles.blurView} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageHeight,
    marginBottom: spacing,
    marginRight: spacing,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});
