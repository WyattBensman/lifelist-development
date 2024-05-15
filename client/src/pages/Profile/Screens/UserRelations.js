import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserRelationsNavigator from "../Navigators/UserRelationsNavigator";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchBar from "../../../components/SearchBar";
import { layoutStyles } from "../../../styles";
import { useEffect } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";

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
        hasBorder={false}
      />
      <View style={[layoutStyles.marginXs, { marginBottom: 0 }]}>
        <SearchBar />
      </View>
      <UserRelationsNavigator />
    </View>
  );
}
