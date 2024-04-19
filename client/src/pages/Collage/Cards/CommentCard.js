import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";

export default function CommentCard() {
  return (
    <View style={layoutStyles.flex}>
      <View style={layoutStyles.flexRow}>
        <Image style={[cardStyles.imageSm, { backgroundColor: "#d4d4d4" }]} />
        <View style={layoutStyles.wrapper}>
          <View style={[layoutStyles.flexRow, layoutStyles.marginBtmTy]}>
            <Text style={[layoutStyles.marginRightXs, { fontWeight: "500" }]}>
              Caleb Kauffman
            </Text>
            <Text style={{ color: "#d4d4d4" }}>2h</Text>
          </View>
          <Text style={layoutStyles.marginRightXs}>
            Okay so this is the actual comment right here cuzzo how do I get
            this shit
          </Text>
        </View>
      </View>
    </View>
  );
}
