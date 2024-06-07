import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { capitalizeText, truncateText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";

export default function ExperienceCard({ experience, associatedShots }) {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.44;
  const imageHeight = cardWidth * 1.35;
  const cardHeight = imageHeight + 44;

  const imageUrl = `${BASE_URL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 20);
  const capitalizedCategory = capitalizeText(experience.category);

  return (
    <View
      style={[
        styles.cardContainer,
        { width: cardWidth, height: cardHeight },
        associatedShots && associatedShots.length > 0 && styles.cardShadow,
      ]}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        style={[styles.image, { height: imageHeight }]}
      />
      <View style={styles.spacer}>
        <Text style={styles.title}>{truncatedTitle}</Text>
        <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 6,
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.075,
    shadowRadius: 1,
  },
  cardShadow: {},
  image: {
    width: "100%",
    borderRadius: 4,
  },
  title: {
    fontWeight: "600",
    marginTop: 4,
  },
  secondaryText: {
    fontSize: 12,
    color: "#8A8A8E",
    marginTop: 1.5,
  },
  spacer: {
    marginLeft: 8,
  },
});
