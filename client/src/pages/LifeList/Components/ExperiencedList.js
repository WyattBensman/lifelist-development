import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ExperienceCard from "../Cards/ExperienceCard";

export default function ExperiencedList() {
  return (
    <View style={layoutStyles.marginTopSm}>
      <Text style={headerStyles.headerMedium}>Experienced</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
