import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";

export default function SelectedShotCard({ item, handleImagePress, drag }) {
  return (
    <Pressable onPress={() => handleImagePress(item._id)} onLongPress={drag}>
      <View style={styles.shotContainer}>
        <Image source={{ uri: item.imageThumbnail }} style={styles.shotImage} />
        {/* Trash icon for removing the selected image */}
        <SymbolView name="trash" style={styles.trash} tintColor={"#d4d4d4"} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shotContainer: {
    position: "relative",
    aspectRatio: 2 / 3,
    marginHorizontal: 4,
  },
  shotImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
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
