import { StyleSheet, Text, View } from "react-native";
import OngoingItem from "../Cards/OngoingItem";
import Upcomingitem from "../Cards/UpcomingItem";

export default function OngoingUpcomingExperiences({ editMode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.ongoingHeader}>Ongoing Experiences</Text>
      <OngoingItem editMode={editMode} />
      <OngoingItem editMode={editMode} />
      <Text style={styles.upcomingHeader}>Upcoming Experiences</Text>
      <Upcomingitem editMode={editMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  ongoingHeader: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  upcomingHeader: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
});
