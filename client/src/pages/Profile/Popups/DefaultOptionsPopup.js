import { Text, View } from "react-native";
import BottomPopup from "./BottomPopup";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import ShareProfile from "../Icons/PopupIcons/ShareProfile";
import CopyProfileUrl from "../Icons/PopupIcons/CopyProfileURL";
import SendMessage from "../Icons/PopupIcons/SendMessage";

export default function DefaultOptionsPopup({ visible, onRequestClose }) {
  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={popupStyles.popupContainer}>
        <Text style={headerStyles.headerMedium}>Profile Options</Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <ShareProfile />
            <Text style={popupStyles.spacer}>Share Profile</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <CopyProfileUrl />
            <Text style={popupStyles.spacer}>Copy Profile URL</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <SendMessage />
            <Text style={popupStyles.spacer}>Send Message</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <Text style={[popupStyles.spacer, { color: "red" }]}>Block</Text>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <Text style={[popupStyles.spacer, { color: "red" }]}>Report</Text>
        </View>
      </View>
    </BottomPopup>
  );
}
