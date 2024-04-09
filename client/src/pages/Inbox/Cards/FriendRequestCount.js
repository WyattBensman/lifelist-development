import { StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";

export default function FriendRequestCount() {
  return (
    <View>
      <View style={[globalStyling.flex, styling.cardContent]}>
        <Text style={styling.cardText}>Friend Request: 6</Text>
        <ForwardArrowIcon />
      </View>
    </View>
  );
}

const styling = StyleSheet.create({
  cardContent: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  cardText: {
    fontSize: 15,
  },
});
