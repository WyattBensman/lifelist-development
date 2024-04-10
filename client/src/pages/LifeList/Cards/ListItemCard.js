import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function ListItemCard() {
  return (
    <View style={cardStyling.container}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <Text style={[cardStyling.username, cardStyling.descriptionContainer]}>
          Jackson Hole, Wyoming
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});
