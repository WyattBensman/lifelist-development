import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ExperienceCard from "../Cards/ExperienceCard";

export default function ActivitiesAttractions() {
  return (
    <View style={layoutStyles.marginTopXl}>
      <Text style={headerStyles.headerMedium}>Activities & Attractions</Text>
      <ExperienceCard />
    </View>
  );
}
