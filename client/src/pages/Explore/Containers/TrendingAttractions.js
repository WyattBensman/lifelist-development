import { Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function TrendingAttractions() {
  return (
    <View style={{ marginTop: 15 }}>
      <Text style={headerStyles.headerMedium}>Trending Attractions</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
