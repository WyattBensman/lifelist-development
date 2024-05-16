import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyles } from "../../../styles";
import { capitalizeText, truncateText } from "../../../utils/utils";

const baseURL = "http://localhost:3001";

export default function ExperienceCard({ experience }) {
  const imageUrl = `${baseURL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 20);
  const capitalizedCategory = capitalizeText(experience.category);

  return (
    <View style={cardStyles.experienceCardContainerLg}>
      <Image
        source={{
          uri: imageUrl,
        }}
        style={cardStyles.imageExperienceLg}
      />
      <View style={cardStyles.leftSpacer}>
        <Text>{truncatedTitle}</Text>
        <Text style={cardStyles.secondaryText}>{capitalizedCategory}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeCard: {
    width: 165,
    overflow: "hidden",
    marginRight: 6,
  },
  image: {
    height: 220,
    width: "100%",
    borderRadius: 6,
  },
  title: {
    marginTop: 2,
  },
  flex: {
    flexDirection: "row",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  descriptionContainer: {
    marginHorizontal: 5,
    marginVertical: 4,
  },
});
