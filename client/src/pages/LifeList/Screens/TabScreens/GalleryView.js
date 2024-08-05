import React from "react";
import { View, FlatList, StyleSheet, Image, Dimensions } from "react-native";
import { BASE_URL } from "../../../../utils/config";

const { width } = Dimensions.get("window");
const imageWidth = width / 2;
const imageHeight = (imageWidth * 3) / 2;

export default function GalleryView({ experienceId, associatedShots }) {
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: `${BASE_URL}${item.shot.image}` }}
        style={styles.image}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={associatedShots}
        keyExtractor={(item) => item.shot._id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
