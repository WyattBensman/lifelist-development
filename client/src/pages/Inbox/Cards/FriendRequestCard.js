import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import { cardStyling } from "../../../styles/CardStyling";

export default function FriendRequestCard() {
  return (
    <View>
      <View style={[globalStyling.flex, cardStyling.container]}>
        <View style={globalStyling.flex}>
          <Image
            source={require("../../../../public/images/wyattbensman.png")}
            style={cardStyling.image}
          />
          <View style={cardStyling.descriptionContainer}>
            <Text style={cardStyling.username}>Wyatt Bensman</Text>
            <Text style={[cardStyling.description, { width: "auto" }]}>
              wants to be your friend.
            </Text>
          </View>
        </View>
        <View style={globalStyling.flex}>
          <View style={styling.acceptBox}>
            <Text style={styling.acceptText}>Accept</Text>
          </View>
          <View style={styling.declineBox}>
            <Text style={styling.declineText}>Decline</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styling = StyleSheet.create({
  acceptBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#5FAF46",
    width: 75,
    marginHorizontal: 2.5,
    backgroundColor: "#5FAF46",
  },
  declineBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#d4d4d4",
    width: 75,
    marginHorizontal: 2.5,
    backgroundColor: "#d4d4d4",
  },
  acceptText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#f4f4f4",
  },
  declineText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
  },
});
