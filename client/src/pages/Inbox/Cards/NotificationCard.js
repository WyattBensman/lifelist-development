import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";

export default function NotificationCard() {
  const messageText = "commented on your collage";
  const truncatedMessage = truncateText(messageText, 30);

  return (
    <View style={layoutStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <View>
          <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
          <Text style={cardStyles.secondaryText}>{truncatedMessage}</Text>
        </View>
      </View>
      <Text style={cardStyles.secondaryText}>39 Minutes ago</Text>
    </View>
  );
}
