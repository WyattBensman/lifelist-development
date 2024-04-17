import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import ChatInputBar from "../Components/ChatInputBar";

export default function Conversation({ navigation }) {
  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Wyatt Bensman"}
        onPress={() => navigation.goBack()}
      />
      <ChatInputBar />
    </View>
  );
}
