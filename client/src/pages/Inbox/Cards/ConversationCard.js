import { Image, Text, View } from "react-native";
import { truncateText } from "../../../utils/utils";
import { cardStyles, layoutStyles } from "../../../styles";

export default function ConversationCard() {
  const messageText = "asdfasdf a?asdf asdf  asdfasdf asdf";
  const truncatedMessage = truncateText(messageText, 25);

  return (
    <View style={layoutStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <View>
          <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
          <Text style={cardStyles.messageText}>{truncatedMessage}</Text>
        </View>
      </View>
      <Text style={cardStyles.secondaryText}>39 Minutes ago</Text>
    </View>
  );
}
