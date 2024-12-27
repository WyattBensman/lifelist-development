import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { truncateText } from "../../../utils/utils";

export default function AlbumCard({ album, navigation }) {
  const truncatedTitle = truncateText(album.title, 18);

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("ViewAlbum", { albumId: album._id })}
    >
      <Image source={{ uri: album.coverImage }} style={styles.albumImage} />
      {/* CONVERT TO PRIMARY TX+TEXT */}
      <Text style={styles.albumTitle}>{truncatedTitle}</Text>
      {/* CONVERT TO SECONDARY TX+TEXT */}
      <Text style={styles.albumCount}>{album.shotsCount} shots</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  albumImage: {
    width: 150,
    height: 150,
  },
  albumTitle: {
    marginTop: 6,
    color: "#fff",
  },
  albumCount: {
    marginTop: 2,
    fontSize: 12,
    color: "#696969",
  },
});
