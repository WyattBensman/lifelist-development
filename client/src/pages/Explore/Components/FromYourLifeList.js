import { StyleSheet, Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";

export default function FromYourListList() {
  return (
    <View>
      <Text style={styles.header}>From your LifeList</Text>
      <View style={styles.flex}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  flex: {
    flexDirection: "row",
  },
});
