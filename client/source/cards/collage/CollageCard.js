import React, { useEffect, useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { cardStyles } from "../../styles/components/cardStyles";
import {
  getImageFromFileSystem,
  saveImageToFileSystem,
} from "../../utils/caching/cacheHelpers";

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
    <Pressable
      onPress={handlePress}
      style={cardStyles.collageThumbnailContainer}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={cardStyles.collageThumbnailImage}
            contentFit="cover"
          />
        )
      )}
    </Pressable>
  );
}
