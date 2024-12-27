import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../styles/components/cardStyles";
import { truncateText } from "../../utils/commonHelpers";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import SmallGreyButton from "../../buttons/SmallGreyButton";
import DangerAlert from "../../alerts/DangerAlert";

export default function AlbumSelectCard({ album, shotId }) {
  const { updateAlbumShotsInCache } = useCameraAlbums();
  const [isShotAdded, setIsShotAdded] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const imageUrl = album.coverImage; // Album cover image
  const truncatedTitle = truncateText(album.title, 40);

  useEffect(() => {
    // Check if the shot exists in the album's `shots`
    const shots = album.shots || []; // Default to an empty array if `shots` is undefined
    setIsShotAdded(shots.some((shot) => shot._id === shotId));
  }, [album.shots, shotId]);

  const handleAddRemoveShot = async () => {
    try {
      const shots = album.shots || [];
      const updatedShots = isShotAdded
        ? shots.filter((shot) => shot._id !== shotId) // Remove the shot
        : [...shots, { _id: shotId }]; // Add the shot

      await updateAlbumShotsInCache(album._id, updatedShots); // Update the cache
      setIsShotAdded(!isShotAdded); // Toggle the state
    } catch (error) {
      console.error("Failed to update album shots:", error);
    }
  };

  const confirmRemoveShot = async () => {
    try {
      const updatedShots = album.shots.filter((shot) => shot._id !== shotId);
      await updateAlbumShotsInCache(album._id, updatedShots);
      setIsShotAdded(false); // Ensure the button updates correctly
      setIsAlertVisible(false); // Close the alert
    } catch (error) {
      console.error("Failed to remove the shot:", error);
    }
  };

  const getTextColor = () => (isShotAdded ? "#6AB952" : "#fff");

  const handleActionPress = () => {
    if (isShotAdded) {
      setIsAlertVisible(true); // Show DangerAlert if removing
    } else {
      handleAddRemoveShot(); // Directly add the shot
    }
  };

  return (
    <>
      <Pressable style={cardStyles.listItemContainer}>
        <View style={cardStyles.contentContainer}>
          {/* Album Cover Image */}
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />

          {/* Text Content */}
          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
            <Text style={cardStyles.secondaryText}>
              Shots: {album.shots ? album.shots.length : album.shotsCount || 0}
            </Text>
          </View>

          {/* Add/Remove Button */}
          <View style={cardStyles.actionButtonSpacer}>
            <SmallGreyButton
              text={isShotAdded ? "Added" : "Add"}
              textColor={getTextColor()}
              onPress={handleActionPress}
            />
          </View>
        </View>
      </Pressable>

      {/* DangerAlert */}
      <DangerAlert
        visible={isAlertVisible}
        onRequestClose={() => setIsAlertVisible(false)}
        message="Are you sure you want to remove this shot?"
        onConfirm={confirmRemoveShot}
      />
    </>
  );
}
