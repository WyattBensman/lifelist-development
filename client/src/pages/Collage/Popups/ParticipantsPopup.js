import { Text, View } from "react-native";

import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import ParticipantCard from "../Cards/ParticipantCard";

export default function ParticipantsPopup({ visible, onRequestClose }) {
  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={popupStyles.popupContainer}>
        <Text style={headerStyles.headerMedium}>Participants</Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <ParticipantCard />
        </View>
      </View>
    </BottomPopup>
  );
}
