import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";

export default function ParticipantCard() {
  return (
    <View style={[cardStyling.container, { flex: 1 }]}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <View
          style={[
            layoutStyles.flex,
            cardStyling.descriptionContainer,
            { flex: 1 },
          ]}
        >
          <View>
            <Text style={cardStyling.username}>Wyatt Bensman</Text>
            <Text style={styles.username}>@wyattbensman</Text>
          </View>
          <ForwardArrowIcon />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 12,
    color: "#d4d4d4",
  },
});
