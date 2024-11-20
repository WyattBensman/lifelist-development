import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";

import IconStatic from "../../../components/Icons/IconStatic";
import BottomPopup from "../../Profile/Popups/BottomPopup";

export default function AuthorOptions({
  visible,
  onRequestClose,
  collageId,
  isArchived,
  handleArchivePress,
}) {
  console.log(isArchived);

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={484}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>Options</Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="paperplane.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Edit</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleArchivePress}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name={isArchived ? "archivebox.fill" : "archivebox"}
              style={iconStyles.popupIcon}
            />
            <Text
              style={[
                popupStyles.spacer,
                styles.text,
                isArchived ? { color: "green" } : { color: "#fff" },
              ]}
            >
              {isArchived ? "Unarchive" : "Archive"}
            </Text>
          </View>
        </Pressable>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            {/* Placeholder for alignment */}
            <View style={iconStyles.popupIcon} />
            <Text
              style={[
                popupStyles.spacer,
                styles.text,
                { color: "red", fontWeight: "500" },
              ]}
            >
              Delete
            </Text>
          </View>
        </View>
        <Text
          style={[headerStyles.headerMedium, styles.text, { marginTop: 8 }]}
        >
          Share
        </Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Copy Link</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Message</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Instagram</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Facebook</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Snapchat</Text>
          </View>
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
