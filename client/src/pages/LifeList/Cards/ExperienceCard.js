import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { capitalizeText, truncateText } from "../../../utils/utils";
import { fetchCachedImageUri } from "../../../utils/cacheHelper";
import { SymbolView } from "expo-symbols";

export default function ExperienceCard({
  experience,
  lifeListExperienceId,
  hasAssociatedShots,
  navigation,
}) {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.44;
  const imageHeight = cardWidth * 1.3375;
  const cardHeight = imageHeight + 44;

  const [imageUri, setImageUri] = useState(null);

  // Construct the image key for caching
  const imageKey = `experience_image_${experience._id}`;

  // Fetch cached image URI using the helper function
  useEffect(() => {
    const fetchImage = async () => {
      const uri = await fetchCachedImageUri(imageKey, experience.image);
      setImageUri(uri);
    };
    fetchImage();
  }, [imageKey, experience.image]);

  const truncatedTitle = truncateText(experience.title, 20);
  const capitalizedCategory = capitalizeText(experience.category);

  const handlePress = () => {
    if (hasAssociatedShots) {
      navigation.navigate("LifeListStack", {
        screen: "ViewExperience",
        params: { experienceId: lifeListExperienceId },
      });
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={!hasAssociatedShots}>
      <View
        style={[
          styles.cardContainer,
          { width: cardWidth, height: cardHeight },
          hasAssociatedShots && styles.cardShadow,
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { height: imageHeight }]}
          onError={(error) =>
            console.error(
              `Error loading image from URI: ${imageUri}`,
              error.nativeEvent
            )
          }
        />
        <View style={styles.spacer}>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <View style={styles.secondaryTextContainer}>
            <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
            {hasAssociatedShots && (
              <SymbolView
                name="photo.on.rectangle"
                style={styles.photoIcon}
                type="monochrome"
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
    marginRight: 6,
    backgroundColor: "#1C1C1C",
    borderRadius: 6,
  },
  image: {
    width: "100%",
    borderRadius: 6,
  },
  title: {
    fontWeight: "600",
    marginTop: 4,
    color: "#fff",
  },
  secondaryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1.5,
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
  },
  photoIcon: {
    marginLeft: 6,
    width: 15,
    height: 12.04,
  },
  spacer: {
    marginLeft: 8,
  },
  photoCircleIcon: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 22.5,
    height: 22.5,
    borderRadius: 15,
    backgroundColor: "rgba(38, 40, 40, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
