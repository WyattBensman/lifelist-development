import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import MediaNavigator from "../Navigators/MediaNavigator";

export default function Media() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Media"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            navigation={navigation}
            navigateTo={"CollageSummary"}
          />
        }
        hasBorder={false}
      />
      <MediaNavigator />
    </View>
  );
}
