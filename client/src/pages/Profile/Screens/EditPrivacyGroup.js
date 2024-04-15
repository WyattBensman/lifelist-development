import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";

export default function EditPrivacyGroup() {
  return (
    <View style={layoutStyles.container}>
      <StackHeader title={"Cool Guys"} arrow={<BackArrowIcon />} />
      <Text>Hey</Text>
    </View>
  );
}
