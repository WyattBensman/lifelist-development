import { View } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import EditProfileNavigator from "../Navigators/EditProfileNavigator";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import Icon from "../../../components/Icons/Icon";

export default function EditProfile() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
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
        title={"Edit Profile"}
        hasBorder={false}
      />
      <EditProfileNavigator />
    </View>
  );
}
