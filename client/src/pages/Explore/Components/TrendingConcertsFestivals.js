import { StyleSheet, Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";

export default function TrendingConcertsFestivals() {
  return (
    <View style={styles.spacer}>
      <Text style={styles.header}>Trending Concerts & Festivals</Text>
      <View style={styles.flex}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    marginTop: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  flex: {
    flexDirection: "row",
  },
});
