import { ScrollView, View } from "react-native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendRequestCard from "../Cards/FriendRequestCard";
import SearchBar from "../../../components/SearchBar";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function FriendRequest({ navigation }) {
  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Friend Request"}
      />
      <View style={layoutStyles.marginXs}>
        <SearchBar />
      </View>
      <ScrollView>
        <FriendRequestCard />
        <FriendRequestCard />
      </ScrollView>
    </View>
  );
}
