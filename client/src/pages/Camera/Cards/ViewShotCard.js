import React, { useEffect, useState, useCallback } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { useCameraRoll } from "../../../contexts/CameraRollContext";

export default function ViewShotCard({ shotId, imageUrl }) {
  const [imageUri, setImageUri] = useState(imageUrl || null);
  const [isFetching, setIsFetching] = useState(false);
  const { fetchFullResolutionImage } = useCameraRoll();

  const fetchImage = useCallback(async () => {
    if (!isFetching && !imageUri) {
      // Only fetch if visible
      setIsFetching(true);
      try {
        const uri = await fetchFullResolutionImage(shotId);
        setImageUri(uri);
      } catch (error) {
        console.error(
          `[ViewShotCard] Error fetching image for ${shotId}:`,
          error
        );
      } finally {
        setIsFetching(false);
      }
    }
  }, [fetchFullResolutionImage, shotId, imageUri, isFetching]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  if (!imageUri) {
    // Show a loading indicator while fetching the image
    return (
      <View style={styles.imageContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUri }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "97.5%",
    height: "97.5%",
    resizeMode: "cover",
    borderRadius: 4,
  },
});
