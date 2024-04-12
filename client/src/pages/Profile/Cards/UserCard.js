import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function UserCard() {
  return (
    <View style={cardStyling.container}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <View style={[globalStyling.flex, { flex: 1 }]}>
          <Text
            style={[cardStyling.username, cardStyling.descriptionContainer]}
          >
            Wyatt Bensman
          </Text>
          <View style={styles.followContainer}>
            <Text style={styles.followText}>Follow</Text>
          </View>
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
  followContainer: {
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#ececec",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
  followingContainer: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followingText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
});
