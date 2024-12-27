import { Text, View, Pressable } from "react-native";
import BottomPopup from "../PopUp";
import { menuStyles, symbolStyles } from "../../../styles";
import Icon from "../../icons/Icon";
import { useNavigation } from "@react-navigation/native";

export default function DefaultProfileOptions({
  visible,
  onRequestClose,
  profileId,
}) {
  const navigation = useNavigation();

  const handleReportPress = () => {
    onRequestClose();
    navigation.navigate("Report", {
      entityId: profileId, // Pass the profile ID
      entityType: "PROFILE", // Specify entity type as "PROFILE"
    });
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={288}>
      <View style={menuStyles.popupContainer}>
        <Text style={[menuStyles.header, menuStyles.popupText]}>
          Profile Options
        </Text>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <View style={menuStyles.flexRow}>
            <Icon name="paperplane.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Share Profile
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <View style={menuStyles.flexRow}>
            <Icon name="doc.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Copy Profile URL
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <View style={menuStyles.flexRow}>
            <Icon name="message.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Send Message
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <Text
            style={[
              menuStyles.spacer,
              menuStyles.popupText,
              { color: "red", fontWeight: "500" },
            ]}
          >
            Block
          </Text>
        </View>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={handleReportPress}
        >
          <Text
            style={[
              menuStyles.spacer,
              menuStyles.popupText,
              { color: "red", fontWeight: "500" },
            ]}
          >
            Report
          </Text>
        </Pressable>
      </View>
    </BottomPopup>
  );
}
