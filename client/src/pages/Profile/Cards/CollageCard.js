import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Dimensions, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchCachedImageUri } from "../../../utils/cacheHelper"; // Import your fetch function

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const imageWidth = (screenWidth - spacing * 2) / 3;

export default function CollageCard({
  collageId,
  path,
  index,
  collages,
  cacheKeyPrefix,
}) {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

  console.log(`COLLAGES FROM CARD: ${collages}`);

  useEffect(() => {
    // Fetch the cached image URI or fallback to the original URL
    const fetchImage = async () => {
      const cacheKey = `${cacheKeyPrefix}${collageId}`;
      const cachedUri = await fetchCachedImageUri(cacheKey, path);
      setImageUri(cachedUri);
    };

    fetchImage();
  }, [collageId, path, cacheKeyPrefix]);

  const handlePress = () => {
    navigation.navigate("ViewCollage", { collages, initialIndex: index });
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageWidth,
    marginRight: spacing,
    marginBottom: spacing,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
