import { View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import BlockedUserCard from "../Cards/BlockedUserCard";

export default function BlockedUsers() {
  const navigation = useNavigation();

  return (
    <View>
      <StackHeader
        title={"Blocked Users"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <BlockedUserCard />
    </View>
  );
}
