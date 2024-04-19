import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";

export default function ParticipantCard() {
  return (
    <View style={[cardStyles.userCardContainer, { flex: 1 }]}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <View>
          <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
          <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
            @wyattbensman
          </Text>
        </View>
      </View>
      <View style={layoutStyles.marginRightXs}>
        <ForwardArrowIcon />
      </View>
    </View>
  );
}
