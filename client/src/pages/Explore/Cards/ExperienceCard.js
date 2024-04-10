import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function ExperienceCard() {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require("../../../../public/images/wyattbensman.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.cardHeader}>Wyatt Bensman</Text>
        <View style={styles.flex}>
          <Text style={styles.cardDescription}>!</Text>
          <Text style={styles.cardDescription}> California</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 115,
    overflow: "hidden",
    borderRadius: 5,
    marginRight: 5,
  },
  image: {
    height: 150,
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  flex: {
    flexDirection: "row",
  },
  descriptionContainer: {
    marginHorizontal: 5,
    marginVertical: 4,
  },
});
