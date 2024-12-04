import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { truncateText } from "../../../utils/utils";

export default function AlbumCard({ album, navigation }) {
  const truncatedTitle = truncateText(album.title, 18);

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("ViewAlbum", { albumId: album._id })}
    >
      <Image source={{ uri: album.coverImage }} style={styles.albumImage} />
      <Text style={styles.albumTitle}>{truncatedTitle}</Text>
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
    color: "#d4d4d4",
  },
});
