import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import IconStatic from "../../../components/Icons/IconStatic";

export default function FriendRequestCount({ followRequestsCount }) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("FriendRequest")}
      style={[layoutStyles.flexRowSpace, styling.cardContent]}
    >
      <Text style={styling.cardText}>
        Friend Requests: {followRequestsCount}
      </Text>
      <IconStatic
        name="chevron.forward"
        style={iconStyles.forwardArrow}
        weight={"semibold"}
      />
    </Pressable>
  );
}

const styling = StyleSheet.create({
  cardContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#1c1c1c",
  },
  cardText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  seeAllText: {
    fontSize: 12,
    color: "#fff",
  },
});
