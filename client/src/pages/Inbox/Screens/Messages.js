import { Pressable, View, Text } from "react-native";
import ConversationCard from "../Cards/ConversationCard";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";

export default function Messages() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <ConversationCard />
      <Pressable onPress={() => navigation.navigate("Conversation")}>
        <Text>Go to Conversation</Text>
      </Pressable>
    </View>
  );
}
