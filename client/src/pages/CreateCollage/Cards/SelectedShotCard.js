import React from "react";
import { Pressable, Image, StyleSheet, View } from "react-native";
import { BASE_URL } from "../../../utils/config";
import { SymbolView } from "expo-symbols";

export default function SelectedShotCard({ item, handleImagePress }) {
  return (
    <Pressable onPress={() => handleImagePress(item._id)}>
      <View style={styles.shotContainer}>
        <Image
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.shotImage}
        />
        <SymbolView name="trash" style={styles.trash} tintColor={"#d4d4d4"} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shotContainer: {
    position: "relative",
    aspectRatio: 2 / 3,
  },
  shotImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  trash: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: [{ translateX: -8.75 }],
    height: 17.5,
    width: 17.5,
    padding: 4,
  },
});
