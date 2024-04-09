import { StyleSheet, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendRequestCard from "../Cards/FriendRequestCard";

export default function FriendRequest({ navigation }) {
  return (
    <View>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Friend Request"}
      />
      <Text style={styles.header}>Requests</Text>
      <FriendRequestCard />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
  },
});
