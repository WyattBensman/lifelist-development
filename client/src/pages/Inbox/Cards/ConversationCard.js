import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import { cardStyling } from "../../../styles/CardStyling";

export default function ConversationCard() {
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
            <Text style={cardStyling.description}>Oh shit fr fr? Dude</Text>
          </View>
        </View>
        <Text style={cardStyling.time}>39 Minutes ago</Text>
      </View>
    </View>
  );
}
