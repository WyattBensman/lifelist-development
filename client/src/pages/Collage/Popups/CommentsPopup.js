import { Text, View } from "react-native";
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import CommentCard from "../Cards/CommentCard";

export default function CommentsPopup({ visible, onRequestClose }) {
  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={popupStyles.popupContainer}>
        <Text style={headerStyles.headerMedium}>Comments</Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <CommentCard />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <CommentCard />
        </View>
      </View>
    </BottomPopup>
  );
}
