import { Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function TrendingCollages() {
  return (
    <View style={{ marginTop: 15 }}>
      <Text style={headerStyles.headerMedium}>Trending Collages</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
