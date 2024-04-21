import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import SummaryNavigator from "../Navigators/SummaryNavigator";
import HeaderStack from "../../../components/Headers/HeaderStack";

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
