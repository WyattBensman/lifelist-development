import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendsIcon from "../Icons/FriendsIcon";
import CreateConversationIcon from "../Icons/CreateConversationIcon";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";
import InboxNavigator from "../Navigators/InboxNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import Icon from "../../../components/Icons/Icon";

export default function Inbox() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title="Inbox"
        hasBorder={false}
        button1={
          <Icon
            name="plus.message"
            onPress={() => navigation.navigate("SearchNewConversation")}
            style={iconStyles.newConversation}
            weight="semibold"
          />
        }
        button2={
          <Icon
            name="person.badge.plus"
            onPress={() => navigation.navigate("SearchNewConversation")}
            style={iconStyles.addFriends}
            weight="semibold"
          />
        }
      />
      <View
        style={[layoutStyles.marginSm, { alignSelf: "center", marginTop: 6 }]}
      >
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
