import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";

export default function ListItemCard() {
  const messageText = "Jackson Hole, Wyoming";
  const truncatedMessage = truncateText(messageText, 30);
  const editMode = true;

  return (
    <View style={cardStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <Text>{truncatedMessage}</Text>
      </View>
      <View style={[layoutStyles.flexRowSpace, layoutStyles.marginRightMd]}>
        {!editMode && selected ? <CheckedBoxIcon /> : <UncheckedBoxIcon />}
      </View>
    </View>
  );
}
