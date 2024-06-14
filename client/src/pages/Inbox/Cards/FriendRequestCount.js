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
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  cardText: {
    fontSize: 15,
  },
});
