import React, { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import { cardStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";

export default function AddShotToAlbumCard({ album, shotId }) {
  const { updateAlbumShotsInCache } = useCameraAlbums();
  const [isShotAdded, setIsShotAdded] = useState(false);

  const imageUrl = album.coverImage; // Use the coverImage directly
  const truncatedTitle = truncateText(album.title, 40);

  useEffect(() => {
    // Check if the shot exists in the album's `shots`
    const shots = album.shots || []; // Default to an empty array if `shots` is undefined
    setIsShotAdded(shots.some((shot) => shot._id === shotId));
  }, [album.shots, shotId]);

  const handleAddRemoveShot = async () => {
    try {
      const shots = album.shots || []; // Default to an empty array
      let updatedShots;

      if (isShotAdded) {
        // Remove the shot from the album
        updatedShots = shots.filter((shot) => shot._id !== shotId);
      } else {
        // Add the shot to the album
        updatedShots = [...shots, { _id: shotId }];
      }

      // Update the shots in the cache
      await updateAlbumShotsInCache(album._id, updatedShots);
      setIsShotAdded(!isShotAdded); // Toggle the state
    } catch (error) {
      console.error("Failed to update album shots:", error);
    }
  };

  return (
    <View>
      <Pressable style={styles.listItemContainer}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{truncatedTitle}</Text>
            <Text style={styles.secondaryText}>
              Shots: {album.shots ? album.shots.length : album.shotsCount || 0}
            </Text>
          </View>
          <Pressable onPress={handleAddRemoveShot}>
            <View
              style={
                isShotAdded
                  ? styles.addedButtonContainer
                  : styles.addButtonContainer
              }
            >
              <Text
                style={
                  isShotAdded ? styles.addedButtonText : styles.addButtonText
                }
              >
                {isShotAdded ? "Added" : "Add"}
              </Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginTop: 4,
    flex: 1,
    padding: 8,
    paddingRight: 16,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 1.5,
  },
  addButtonContainer: {
    backgroundColor: "#252525",
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "500",
  },
  addedButtonContainer: {
    backgroundColor: "#6AB95230",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#6AB95250",
    paddingVertical: 5,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addedButtonText: {
    color: "#6AB952",
    fontSize: 12,
    fontWeight: "500",
  },
});
