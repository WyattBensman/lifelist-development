import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import cardStyles from "../../styles/components/cardStyles";
import { truncateText, capitalizeText } from "../../utils/commonHelpers";
import CheckBox from "expo-checkbox";
import { getImageFromFileSystem } from "../../utils/caching/cacheHelper";

export default function ExperienceSearchCard({
  experience,
  isSelected,
  onSelect,
  isPreExisting,
}) {
  const [isChecked, setIsChecked] = useState(isSelected);
  const [cachedImageUri, setCachedImageUri] = useState(null);

  useEffect(() => {
    const loadCachedImage = async () => {
      const cacheKey = `experience_image_${experience._id}`;
      const uri = await getImageFromFileSystem(cacheKey);
      setCachedImageUri(uri);
    };
    loadCachedImage();
  }, [experience]);

  const truncatedTitle = truncateText(experience.title, 30);
  const capitalizedCategory = capitalizeText(experience.category);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    if (!isPreExisting) {
      setIsChecked(!isChecked);
      onSelect(experience, !isChecked);
    }
  };

  return (
    <View
      style={[
        cardStyles.listItemContainer,
        isPreExisting && cardStyles.disabled,
      ]}
    >
      <Pressable onPress={handlePress} style={{ flex: 1 }}>
        <View style={cardStyles.contentContainer}>
          <Image source={{ uri: cachedImageUri }} style={cardStyles.imageMd} />
          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
            <Text style={cardStyles.secondaryText}>{capitalizedCategory}</Text>
          </View>
          <CheckBox
            value={isChecked}
            onValueChange={handlePress}
            disabled={isPreExisting}
            style={cardStyles.checkbox}
            color={isChecked ? "#6AB952" : "#d4d4d4"}
          />
        </View>
      </Pressable>
    </View>
  );
}
