import { View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import { layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Collage from "../../../components/Cards/Collage";
import IconHeader from "../../../icons/IconHeader";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useEffect } from "react";

export default function MainFeed() {
  const { logout, currentUser } = useAuth();
  const { setIsTabBarVisible } = useNavigationContext();
  const navigation = useNavigation();

  const navigateToUserProfile = () => {
    navigation.navigate("Profile", { userId: "663a3133e0ffbeff092b81db" });
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<IconHeader name="plus.square.on.square" />}
        icon2={<IconHeader name="bell" />}
      />
      <Collage />
    </View>
  );
}
