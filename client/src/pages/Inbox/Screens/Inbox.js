import { View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigationContext } from "../../../utils/NavigationContext";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import CreateConversationIcon from "../Icons/CreateConversationIcon";
import SearchBar from "../../../components/SearchBar";
import InboxNavigator from "../Navigators/InboxNavigator";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function Inbox({ navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true); // Cleanup to show the tab bar again
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Inbox"}
        button1={<FriendsIcon />}
        button2={<CreateConversationIcon />}
      />
      <View style={[layoutStyles.marginXs, { marginBottom: 0 }]}>
        <SearchBar />
      </View>
      <InboxNavigator />
    </View>
  );
}
