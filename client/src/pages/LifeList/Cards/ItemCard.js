import { Image, StyleSheet, Text, View } from "react-native";
import PinIcon from "../Icons/PinIcon";
import TicketIcon from "../Icons/TicketIcon";

export default function ItemCard({ editMode }) {
  return (
    <View style={styles.largeCard}>
      <Image
        source={require("../../../../public/images/jackson-hole-01.png")}
        style={styles.image}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Jackson Hole</Text>
        <View style={styles.flex}>
          <PinIcon />
          <Text style={styles.description}>Wyoming</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeCard: {
    width: 165,
    overflow: "hidden",
    marginRight: 4,
  },
  image: {
    width: 165,
    height: 220,
    borderRadius: 5,
  },
  title: {
    marginTop: 2,
  },
  flex: {
    flexDirection: "row",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  descriptionContainer: {
    marginHorizontal: 5,
    marginVertical: 4,
  },
});
