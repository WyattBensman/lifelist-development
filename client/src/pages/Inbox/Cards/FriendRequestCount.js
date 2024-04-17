import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";

export default function FriendRequestCount() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("FriendRequest")}
      style={[layoutStyles.flexRowSpace, styling.cardContent]}
    >
      <Text style={styling.cardText}>Friend Request: 6</Text>
      <ForwardArrowIcon />
    </Pressable>
  );
}

const styling = StyleSheet.create({
  cardContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  cardText: {
    fontSize: 15,
  },
});
