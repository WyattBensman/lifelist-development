import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";

export default function UserRelationsCard() {
  return (
    <View style={cardStyles.userCardContainer}>
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
      {/* NEED THIS TO EITHER BE FOLLOW OR FOLLOWING CONTAINER & TEXT */}
      <View style={layoutStyles.marginRightMd}>
        <ButtonSmall text={"Follow"} backgroundColor={"#ececec"} />
      </View>
    </View>
  );
}
