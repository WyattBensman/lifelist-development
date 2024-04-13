import { View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendRequestCard from "../Cards/FriendRequestCard";
import { layoutStyles } from "../../../styles";
import SearchBar from "../../../components/SearchBar";

export default function FriendRequest({ navigation }) {
  return (
    <View style={layoutStyles.container}>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Friend Request"}
      />
      <View style={[layoutStyles.marginContainer, { marginBottom: 10 }]}>
        <SearchBar />
      </View>
      <FriendRequestCard />
      <FriendRequestCard />
    </View>
  );
}
