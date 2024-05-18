import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";

export default function AlbumCard({ album, navigation }) {
  return (
    <Pressable
      style={layoutStyles.marginRightMd}
      onPress={() => navigation.navigate("ViewAlbum", { albumId: album._id })}
    >
      <Image source={{ uri: album.coverImage }} style={styles.albumImage} />
      <Text style={styles.albumTitle}>{album.title}</Text>
      <Text style={styles.albumCount}>{album.shotsCount} shots</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  albumContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  albumTitle: {
    marginTop: 5,
    fontSize: 14,
  },
  albumCount: {
    fontSize: 12,
  },
});
