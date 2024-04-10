import { StyleSheet, Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";

export default function WishListedList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wish Listed</Text>
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
  container: {
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  flex: {
    flexDirection: "row",
  },
});
