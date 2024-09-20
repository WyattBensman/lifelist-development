import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { cardStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import {
  ADD_SHOT_TO_ALBUM,
  REMOVE_SHOT_FROM_ALBUM,
} from "../../../utils/mutations";

export default function AddShotToAlbumCard({ album, shotId }) {
  const [isShotAdded, setIsShotAdded] = useState(false);

  const imageUrl = `${BASE_URL}${album.coverImage}`;
  const truncatedTitle = truncateText(album.title, 40);
  const shotsCount = album.shots.length;

  useEffect(() => {
    setIsShotAdded(album.shots.some((shot) => shot._id === shotId));
  }, [album.shots, shotId]);

  const [addShotToAlbum] = useMutation(ADD_SHOT_TO_ALBUM);
  const [removeShotFromAlbum] = useMutation(REMOVE_SHOT_FROM_ALBUM);

  const handleAddRemoveShot = async () => {
    try {
      if (isShotAdded) {
        await removeShotFromAlbum({
          variables: {
            albumId: album._id,
            shotId: shotId,
          },
        });
      } else {
        await addShotToAlbum({
          variables: {
            albumId: album._id,
            shotId: shotId,
          },
        });
      }
      setIsShotAdded(!isShotAdded);
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
            <Text style={styles.secondaryText}>{`Shots: ${shotsCount}`}</Text>
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
  // "Add" button uses the commentsButton styling with dark background and white text
  addButtonContainer: {
    backgroundColor: "#252525", // Dark background for the "Add" button
    borderRadius: 24, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#aaa", // White text for the "Add" button
    fontSize: 12,
    fontWeight: "500",
  },
  addedButtonContainer: {
    backgroundColor: "#6AB95230", // Light green background
    borderRadius: 24, // Rounded corners
    borderWidth: 1,
    borderColor: "#6AB95250", // Green border color
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
