import { Pressable, Text, View } from "react-native";
import Header from "../../../components/Header";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import LogbookIcon from "../Icons/LogbookIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import Collage from "../../Collage/Screens/Collage";
import HeaderMain from "../../../components/Headers/HeaderMain";

export default function MainFeed() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon2={<LogbookIcon />}
        icon3={<InboxIcon />}
      />
      <Collage />
    </View>
  );
}

{
  /* <Pressable onPress={() => navigation.navigate("Authentication")}>
        <Text>Login & Sign Up Screens</Text>
      </Pressable> */
}
