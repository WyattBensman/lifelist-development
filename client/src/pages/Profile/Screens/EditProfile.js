import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import EditProfileNavigator from "../Navigators/EditProfileNavigator";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useNavigationContext } from "../../../utils/NavigationContext";
import { useEffect } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";

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
      />
      <EditProfileNavigator />
    </View>
  );
}
