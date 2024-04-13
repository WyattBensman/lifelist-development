import { Image, Text, View } from "react-native";
import BottomPopup from "./BottomPopup";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import ShareProfile from "../Icons/PopupIcons/ShareProfile";
import CopyProfileUrl from "../Icons/PopupIcons/CopyProfileURL";
import Facebook from "../Icons/FlowpageIcons/Facebook";
import Instagram from "../Icons/FlowpageIcons/Instagram";

export default function FlowPagePopup({ visible, onRequestClose }) {
  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={popupStyles.popupContainer}>
        <View style={layoutStyles.flex}>
          <Text style={headerStyles.headerMedium}>Profile Options</Text>
          <Text style={{ fontSize: 12, color: "#d4d4d4", paddingBottom: 8 }}>
            Edit
          </Text>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <Facebook />
            <Text style={popupStyles.spacer}>Facebook</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <Instagram />
            <Text style={popupStyles.spacer}>Instagram</Text>
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
      </View>
    </BottomPopup>
  );
}
