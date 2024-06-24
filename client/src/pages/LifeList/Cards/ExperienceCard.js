import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { capitalizeText, truncateText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import { SymbolView } from "expo-symbols";

export default function ExperienceCard({
  experience,
  lifeListExperienceId,
  associatedShots,
  navigation,
}) {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.44;
  const imageHeight = cardWidth * 1.33;
  const cardHeight = imageHeight + 44;

  const imageUrl = `${BASE_URL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 20);
  const capitalizedCategory = capitalizeText(experience.category);

  const handlePress = () => {
    if (associatedShots && associatedShots.length > 0) {
      navigation.navigate("LifeListStack", {
        screen: "ViewExperience",
        params: { experienceId: lifeListExperienceId },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!associatedShots || associatedShots.length === 0}
    >
      <View
        style={[
          styles.cardContainer,
          { width: cardWidth, height: cardHeight },
          associatedShots && associatedShots.length > 0 && styles.cardShadow,
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { height: imageHeight }]}
        />
        {associatedShots && associatedShots.length > 0 && (
          <View style={styles.photoCircleIcon}>
            <SymbolView
              name="photo.on.rectangle"
              style={styles.photoIcon}
              type="monochrome"
              tintColor="#ececec"
            />
          </View>
        )}
        <View style={styles.spacer}>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
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
  secondaryText: {
    fontSize: 12,
    marginTop: 1.5,
    color: "#696969",
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
  photoIcon: {
    marginLeft: 1,
    width: 15,
    height: 12.04,
  },
});
