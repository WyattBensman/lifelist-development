import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";

const { width } = Dimensions.get("window");
const shotWidth = width / 3;
const shotHeight = (shotWidth * 3) / 2;

const baseURL = "http://localhost:3001";

export default function ShotCard({ shot }) {
  console.log(shot.image);
  const imageUrl = `${baseURL}${shot.image}`;

  return (
    <View style={styles.shotContainer}>
      <Image source={{ uri: imageUrl }} style={styles.shotImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  shotContainer: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: 10,
  },
  shotImage: {
    width: "100%",
    height: "100%",
  },
});
