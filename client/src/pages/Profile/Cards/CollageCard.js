import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
  getImageFromFileSystem,
  saveImageToFileSystem,
} from "../../../utils/newCacheHelper"; //

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
  const [loading, setLoading] = useState(true);

  const handlePress = () => {
    navigation.navigate("ViewCollage", { collages, initialIndex: index });
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const cacheKey = `${cacheKeyPrefix}${collageId}`;
        let uri = await getImageFromFileSystem(cacheKey);

        if (!uri) {
          uri = await saveImageToFileSystem(cacheKey, path);
        }

        setImageUri(uri);
      } catch (error) {
        console.error(
          `[CollageCard] Error fetching image for ${collageId}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [collageId, path, cacheKeyPrefix]);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
        )
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525", // Fallback background color while loading
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
