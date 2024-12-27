import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { Image } from "expo-image";
import { capitalizeText, truncateText } from "../../../utils/utils";
import { SymbolView } from "expo-symbols";
import { getImageFromFileSystem } from "../../../utils/newCacheHelper";

export default function ExperienceCard({
  experience,
  lifeListExperienceId,
  hasAssociatedShots,
  navigation,
  cardWidth,
  imageHeight,
  cardHeight,
}) {
  const [imageUri, setImageUri] = useState(null);

  const truncatedTitle = truncateText(experience.title, 19);
  const capitalizedCategory = capitalizeText(experience.category);

  useEffect(() => {
    const fetchCachedImage = async () => {
      const cacheKey = `experience_image_${experience._id}`;

      const cachedUri = await getImageFromFileSystem(cacheKey);

      setImageUri(cachedUri || experience.image);
    };
    fetchCachedImage();
  }, [experience]);

  const handleNavigateToDetails = () => {
    navigation.navigate("LifeListStack", {
      screen: "ViewExperience",
      params: { experienceId: lifeListExperienceId },
    });
  };

  return (
    <Pressable
      onPress={handleNavigateToDetails}
      disabled={!hasAssociatedShots}
      style={{ width: cardWidth }}
    >
      <View style={[styles.cardContainer, { height: cardHeight }]}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { height: imageHeight }]}
        />
        <View style={styles.spacer}>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <View style={styles.secondaryTextContainer}>
            <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
            {hasAssociatedShots && (
              <SymbolView
                name="photo.on.rectangle"
                style={styles.photoIcon}
                tintColor="#696969"
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 8,
    borderRadius: 6,
  },
  image: {
    borderRadius: 6,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  secondaryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 2,
  },
  photoIcon: {
    marginLeft: 6,
    width: 15,
    height: 12,
  },
  spacer: {
    marginTop: 6,
    marginLeft: 8,
  },
});
