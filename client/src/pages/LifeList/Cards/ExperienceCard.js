import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import PinIcon from "../Icons/PinIcon";

export default function ExperienceCard() {
  return (
    <View style={cardStyles.experienceCardContainerLg}>
      <Image
        source={require("../../../../public/images/jackson-hole-01.png")}
        style={cardStyles.imageExperienceLg}
      />
      <View style={cardStyles.leftSpacer}>
        <Text>Jackson Hole</Text>
        <View style={layoutStyles.flexRow}>
          <PinIcon />
          <Text style={cardStyles.secondaryText}>Wyoming</Text>
        </View>
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
