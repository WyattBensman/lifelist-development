import { Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import BottomBar from "../Components/BottomBar";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function Conversation({ navigation }) {
  return (
    <View style={globalStyling.container}>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Wyatt Bensman"}
        onPress={() => navigation.goBack()}
      />
      <BottomBar />
    </View>
  );
}
