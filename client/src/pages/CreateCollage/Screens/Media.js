import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import MediaNavigator from "../Navigators.js/MediaNavigator";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

export default function Media() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Media"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            navigation={navigation}
            navigateTo={"CollageSummary"}
          />
        }
      />
      <MediaNavigator />
    </View>
  );
}
