import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import SummaryNavigator from "../Navigators/SummaryNavigator";

export default function Summary() {
  navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Summary"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            navigation={navigation}
            navigateTo={"CollageOverview"}
          />
        }
        hasBorder={false}
      />
      <SummaryNavigator />
    </View>
  );
}
