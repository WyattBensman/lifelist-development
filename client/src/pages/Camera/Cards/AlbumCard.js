import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { truncateText } from "../../../utils/utils";
import { fetchCachedImageUri } from "../../../utils/cacheHelper";

export default function AlbumCard({ album, navigation }) {
  const [cachedImageUri, setCachedImageUri] = useState(null);
  const truncatedTitle = truncateText(album.title, 18);
  console.log(album._id);

  useEffect(() => {
    // Fetch or cache the image URI
    const fetchImage = async () => {
      const uri = await fetchCachedImageUri(
        `album_cover_${album._id}`,
        album.coverImage
      );
      setCachedImageUri(uri);
    };
    fetchImage();
  }, [album._id, album.coverImage]);

  if (!cachedImageUri) return null; // Render nothing while loading

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("ViewAlbum", { albumId: album._id })}
    >
      <Image source={{ uri: cachedImageUri }} style={styles.albumImage} />
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
