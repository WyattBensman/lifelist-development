import { StyleSheet, Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function TrendingDestinations() {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={headerStyles.headerMedium}>Trending Destinations</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
