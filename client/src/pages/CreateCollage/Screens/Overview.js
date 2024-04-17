import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

export default function Overview() {
  navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Overview"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            navigation={navigation}
            navigateTo={"CollagePreview"}
          />
        }
      />
    </View>
  );
}
