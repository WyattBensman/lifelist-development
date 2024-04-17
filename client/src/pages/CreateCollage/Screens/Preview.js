import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

export default function Preview() {
  navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Preview"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<Text>Post</Text>}
      />
    </View>
  );
}
