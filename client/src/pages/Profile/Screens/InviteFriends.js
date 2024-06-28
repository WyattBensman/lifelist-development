import React, { useState, useEffect } from "react";
import { View } from "react-native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";
import InviteFriendsNavigator from "../Navigators/InviteFriendsNavigator";
import { layoutStyles, iconStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";

export default function InviteFriends() {
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
        title="Invite Friends"
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        hasBorder={false}
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
      <InviteFriendsNavigator searchQuery={searchQuery} />
    </View>
  );
}
