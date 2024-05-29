import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserRelationsNavigator from "../Navigators/UserRelationsNavigator";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";

export default function UserRelations() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const userId = route.params?.params?.userId; // Get the userId from the route parameters

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="User Relations"
        arrow={<BackArrowIcon navigation={navigation} />}
        hasBorder={false}
      />
      <View
        style={[
          layoutStyles.marginSm,
          { alignSelf: "center", marginBottom: 4 },
        ]}
      >
        <SearchBarStandard style={{ flex: 1 }} />
      </View>
      <UserRelationsNavigator userId={userId} />
    </View>
  );
}
