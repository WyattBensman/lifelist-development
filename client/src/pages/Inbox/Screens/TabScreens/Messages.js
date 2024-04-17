import { Pressable, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../../styles";
import ConversationCard from "../../Cards/ConversationCard";

export default function Messages() {
  const navigation = useNavigation();

  return (
    <ScrollView style={[layoutStyles.wrapper, layoutStyles.paddingTopXs]}>
      <ConversationCard />
      <ConversationCard />
      <ConversationCard />
      <Pressable onPress={() => navigation.navigate("Conversation")}>
        <Text>Go to Conversation</Text>
      </Pressable>
    </ScrollView>
  );
}
