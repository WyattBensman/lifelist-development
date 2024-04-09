import { Pressable, View, Text } from "react-native";
import ConversationCard from "../Cards/ConversationCard";
import { useNavigation } from "@react-navigation/native";

export default function Messages() {
  const navigation = useNavigation();

  return (
    <View>
      <ConversationCard />
      <Pressable onPress={() => navigation.navigate("Conversation")}>
        <Text>Go to Conversation</Text>
      </Pressable>
    </View>
  );
}
