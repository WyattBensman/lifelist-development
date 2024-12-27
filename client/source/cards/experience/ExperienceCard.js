import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { capitalizeText, truncateText } from "../../utils/commonHelpers";
import { SymbolView } from "expo-symbols";
import { fetchCachedImageUri } from "../../utils/caching/cacheHelper";
import { cardStyles } from "../../styles/components/cardStyles";
import { symbolStyles } from "../../styles/components/symbolStyles";

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
      const uri = await fetchCachedImageUri(cacheKey, experience.image);
      setImageUri(uri);
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
      <View
        style={[cardStyles.experienceCardContainer, { height: cardHeight }]}
      >
        <Image
          source={{ uri: imageUri }}
          style={[
            cardStyles.imageRadius,
            { height: imageHeight, width: cardWidth },
          ]}
        />
        <View style={cardStyles.textContainerSpacer}>
          <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
          <View style={cardStyles.secondaryTextContainer}>
            <Text style={cardStyles.secondaryText}>{capitalizedCategory}</Text>
            {hasAssociatedShots && (
              <SymbolView
                name="photo.on.rectangle"
                style={symbolStyles.photoIcon}
                tintColor="#696969"
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
