import { Text, View, StyleSheet } from "react-native";
import BottomPopup from "./BottomPopup";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";

import IconStatic from "../../../components/Icons/IconStatic";

export default function DefaultOptionsPopup({ visible, onRequestClose }) {
  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>
          Profile Options
        </Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="paperplane.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Share Profile</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="doc.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>
              Copy Profile URL
            </Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Send Message</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <Text
            style={[
              popupStyles.spacer,
              styles.text,
              { color: "red", fontWeight: "500" },
            ]}
          >
            Block
          </Text>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <Text
            style={[
              popupStyles.spacer,
              styles.text,
              { color: "red", fontWeight: "500" },
            ]}
          >
            Report
          </Text>
        </View>
      </View>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
  },
});
