import { Image, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import { cardStyling } from "../../../styles/CardStyling";

export default function NotificationCard() {
  return (
    <View>
      <View style={[globalStyling.flex, cardStyling.container]}>
        <View style={globalStyling.flex}>
          <Image
            source={require("../../../../public/images/wyattbensman.png")}
            style={cardStyling.image}
          />
          <View style={cardStyling.descriptionContainer}>
            <Text style={cardStyling.username}>Wyatt Bensman</Text>
            <Text style={cardStyling.description}>
              commented on your collage
            </Text>
          </View>
        </View>
        <Text style={cardStyling.time}>39 Minutes ago</Text>
      </View>
    </View>
  );
}
