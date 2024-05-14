import { Pressable, Text, View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";

export default function MainFeed() {
  const { logout } = useAuth();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon3={<InboxIcon />}
      />
      <Pressable onPress={logout}>
        <Text style={{ margin: 20 }}>Logout</Text>
      </Pressable>
    </View>
  );
}
