import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";

export default function EditFlowPage() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Edit Flowpage"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
    </View>
  );
}
