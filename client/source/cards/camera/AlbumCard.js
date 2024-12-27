import React from "react";
import { Pressable, Text } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../styles/components/cardStyles";
import { truncateText } from "../../utils/commonHelpers";

export default function AlbumCard({ album, navigation }) {
  const truncatedTitle = truncateText(album.title, 18);

  return (
    <Pressable
      style={cardStyles.cameraAlbumCardContainer}
      onPress={() => navigation.navigate("ViewAlbum", { albumId: album._id })}
    >
      {/* Album Image */}
      <Image source={{ uri: album.coverImage }} style={cardStyles.albumImage} />

      {/* Album Title */}
      <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>

      {/* Album Shots Count */}
      <Text style={cardStyles.secondaryText}>{album.shotsCount} shots</Text>
    </Pressable>
  );
}
