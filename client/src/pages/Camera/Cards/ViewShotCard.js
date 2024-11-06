import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { fetchCachedImageUri } from "../../../utils/cacheHelper";

export default function ViewShotCard({ imageUrl, shotId }) {
  const [cachedImageUri, setCachedImageUri] = useState(null);

  useEffect(() => {
    // Fetch or cache the image URI
    const fetchImage = async () => {
      const uri = await fetchCachedImageUri(`camera_shot_${shotId}`, imageUrl);
      setCachedImageUri(uri);
    };
    fetchImage();
  }, [imageUrl]);

  if (!cachedImageUri) return null; // Render nothing while loading

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: cachedImageUri }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
