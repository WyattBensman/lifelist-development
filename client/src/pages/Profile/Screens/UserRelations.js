import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserRelationsNavigator from "../Navigators/UserRelationsNavigator";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchBar from "../../../components/SearchBar";
import { layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../utils/NavigationContext";
import { useEffect } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function UserRelations() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="User Relations"
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View style={[layoutStyles.marginXs, { marginBottom: 0 }]}>
        <SearchBar />
      </View>
      <UserRelationsNavigator />
    </View>
  );
}
