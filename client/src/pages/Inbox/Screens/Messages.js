import { Pressable, View, Text } from "react-native";
import ConversationCard from "../Cards/ConversationCard";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../utils/ThemeContext";
import { globalStyling } from "../../../styles/GlobalStyling";

export default function Messages() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ConversationCard />
      <Pressable onPress={() => navigation.navigate("Conversation")}>
        <Text>Go to Conversation</Text>
      </Pressable>
    </View>
  );
}
