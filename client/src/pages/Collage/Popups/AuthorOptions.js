import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";
import IconStatic from "../../../components/Icons/IconStatic";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import { useNavigation } from "@react-navigation/native";

export default function AuthorOptions({
  visible,
  onRequestClose,
  collageId,
  collageData,
  isArchived,
  handleArchivePress,
}) {
  const navigation = useNavigation();

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={484}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>Options</Text>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => {
            onRequestClose(); // Close the popup
            navigation.navigate("CollageStack", {
              screen: "EditMedia",
              params: {
                collageId, // Pass the collage ID
                collageData, // Pass the collage data object
              },
            });
          }}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name="pencil.and.outline"
              tintColor={"#6AB952"}
              weight={"semibold"}
              style={iconStyles.popupIcon}
            />
            <Text style={[popupStyles.spacer, styles.greenText]}>Edit</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
            tintColor={"#6AB952"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleArchivePress}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name={isArchived ? "archivebox.fill" : "archivebox"}
              style={iconStyles.popupIcon}
              tintColor={"#5FC4ED"}
            />
            <Text style={[popupStyles.spacer, styles.blueText]}>
              {isArchived ? "Unarchive" : "Archive"}
            </Text>
          </View>
        </Pressable>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            {/* Placeholder for alignment */}
            <IconStatic
              name={"trash"}
              style={iconStyles.popupIcon}
              tintColor={"#FF6347"}
            />
            <Text style={[popupStyles.spacer, styles.redText]}>Delete</Text>
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
  greenText: {
    color: "#6AB952",
    fontWeight: "600",
  },
  blueText: {
    color: "#5FC4ED",
    fontWeight: "600",
  },
  redText: { color: "#FF6347", fontWeight: "600" },
});
