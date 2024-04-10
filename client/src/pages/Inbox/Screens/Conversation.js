import { Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import BottomBar from "../Components/BottomBar";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "../../../utils/ThemeContext";

export default function Conversation({ navigation }) {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Wyatt Bensman"}
        onPress={() => navigation.goBack()}
      />
      <BottomBar />
    </View>
  );
}
