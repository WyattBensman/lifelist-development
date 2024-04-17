import { Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function TrendingConcertsFestivals() {
  return (
    <View style={layoutStyles.marginTopLg}>
      <Text style={headerStyles.headerMedium}>
        Trending Concerts & Festivals
      </Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
