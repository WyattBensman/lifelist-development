import { Text, View, StyleSheet, Pressable } from "react-native";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";

import IconStatic from "../../../components/Icons/IconStatic";
import { useNavigation } from "@react-navigation/native";

export default function DefaultOptions({
  visible,
  onRequestClose,
  collageId,
  isSaved,
  handleSavePress,
}) {
  const navigation = useNavigation();

  // Handle report press and navigate to the universal Report page
  const handleReportPress = () => {
    onRequestClose();
    navigation.navigate("Report", {
      entityId: collageId, // Pass the collage ID
      entityType: "COLLAGE", // Specify entity type as "COLLAGE"
    });
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={432}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>Options</Text>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleSavePress}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name={isSaved ? "bookmark.fill" : "bookmark"}
              style={iconStyles.popupIcon}
              tintColor={"#6AB952"}
              weight={"semibold"}
            />
            <Text style={[popupStyles.spacer, styles.greenText]}>
              {isSaved ? "Unsave" : "Save"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleReportPress}
        >
          <View style={layoutStyles.flexRow}>
            {/* Placeholder for alignment */}
            <IconStatic
              name={"exclamationmark.bubble"}
              style={iconStyles.popupIcon}
              tintColor={"#FF6347"}
              weight={"semibold"}
              onPress={handleReportPress}
            />
            <Text style={[popupStyles.spacer, styles.redText]}>Report</Text>
          </View>
        </Pressable>
        <Text
          style={[headerStyles.headerMedium, styles.text, { marginTop: 8 }]}
        >
          Share
        </Text>
        {/* Share options */}
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
  redText: { color: "#FF6347", fontWeight: "600" },
});
