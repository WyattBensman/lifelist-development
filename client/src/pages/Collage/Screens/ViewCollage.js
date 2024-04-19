import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import CollageNavigator from "../Navigators/CollageNavigator";
import CollagePanel from "../PanelComponents/CollagePanel";
import { useState } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import OptionsIcon from "../Icons/OptionsIcon";
import ShareIcon from "../Icons/ShareIcon";
import LifeListLogo from "../Icons/LifeListLogo";

export default function ViewCollage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={<LifeListLogo />}
        button1={
          isAdmin ? (
            <>
              <OptionsIcon color={"#000000"} />
            </>
          ) : (
            <Text style={{ color: "red", fontWeight: "500", fontSize: 12 }}>
              Report
            </Text>
          )
        }
        button2={isAdmin && <ShareIcon color={"#000000"} marginRight={0} />}
      />
      <CollageNavigator />
      <CollagePanel isAdmin={isAdmin} />
    </View>
  );
}
