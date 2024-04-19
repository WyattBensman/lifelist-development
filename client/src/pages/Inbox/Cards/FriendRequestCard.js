import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";

export default function FriendRequestCard() {
  return (
    <View style={cardStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <View>
          <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
          <Text style={cardStyles.secondaryText}>wants to be your friend.</Text>
        </View>
      </View>
      <View style={layoutStyles.flexRow}>
        <ButtonSmall
          text={"Accept"}
          textColor={"#ffffff"}
          backgroundColor={"#5FAF46"}
        />
        <ButtonSmall
          text={"Decline"}
          textColor={"#000000"}
          backgroundColor={"#ececec"}
        />
      </View>
    </View>
  );
}
