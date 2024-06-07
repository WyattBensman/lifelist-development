import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import EditProfileNavigator from "../Navigators/EditProfileNavigator";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function EditProfile() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Edit Profile"}
        hasBorder={false}
      />
      <EditProfileNavigator />
    </View>
  );
}
