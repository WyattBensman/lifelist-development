import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import BlockedUserCard from "../Cards/BlockedUserCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { layoutStyles } from "../../../styles";

export default function BlockedUsers() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Blocked Users"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <ScrollView style={[layoutStyles.wrapper, layoutStyles.paddingTopXs]}>
        <BlockedUserCard />
      </ScrollView>
    </View>
  );
}
