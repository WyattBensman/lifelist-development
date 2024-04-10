import { StyleSheet, Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";

export default function ExpereincedList() {
  return (
    <View>
      <Text style={styles.header}>Experienced</Text>
      <View style={styles.flex}>
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  flex: {
    flexDirection: "row",
  },
});
