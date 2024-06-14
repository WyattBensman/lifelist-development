import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import CreateConversationIcon from "../Icons/CreateConversationIcon";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";
import InboxNavigator from "../Navigators/InboxNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function Inbox() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title="Inbox"
        hasBorder={false}
      />
      <View style={[layoutStyles.marginSm, { alignSelf: "center" }]}>
        <SearchBarStandard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => {}}
          onFocusChange={() => {}}
        />
      </View>
      <InboxNavigator searchQuery={searchQuery} initialTab="Messages" />
    </View>
  );
}
