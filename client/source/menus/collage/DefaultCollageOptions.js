import { Text, View, Pressable } from "react-native";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import { menuStyles, symbolStyles } from "../../../styles";
import Icon from "../../icons/Icon";
import { useNavigation } from "@react-navigation/native";

export default function DefaultCollageOptions({
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

  const shareOptions = [
    { name: "Copy Link", icon: "link.circle", onPress: () => {} },
    { name: "Message", icon: "message.circle", onPress: () => {} },
    { name: "Instagram", icon: "logo.instagram", onPress: () => {} },
    { name: "Facebook", icon: "logo.facebook", onPress: () => {} },
    { name: "Snapchat", icon: "logo.snapchat", onPress: () => {} },
  ];

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={432}>
      <View style={menuStyles.popupContainer}>
        <Text style={menuStyles.header}>Options</Text>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={handleSavePress}
        >
          <View style={menuStyles.flexRow}>
            <Icon
              name={isSaved ? "bookmark.fill" : "bookmark"}
              style={symbolStyles.popupIcon}
              tintColor="#6AB952"
              weight="semibold"
            />
            <Text style={[menuStyles.spacer, menuStyles.greenText]}>
              {isSaved ? "Unsave" : "Save"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={handleReportPress}
        >
          <View style={menuStyles.flexRow}>
            <Icon
              name="exclamationmark.bubble"
              style={symbolStyles.popupIcon}
              tintColor="#FF6347"
              weight="semibold"
            />
            <Text style={[menuStyles.spacer, menuStyles.redText]}>Report</Text>
          </View>
        </Pressable>
        <Text style={[menuStyles.header, menuStyles.shareHeader]}>Share</Text>
        {shareOptions.map((option, index) => (
          <Pressable
            key={index}
            style={[menuStyles.cardContainer, menuStyles.flex]}
            onPress={option.onPress}
          >
            <View style={menuStyles.flexRow}>
              <Icon name={option.icon} style={symbolStyles.popupIcon} />
              <Text style={[menuStyles.spacer, menuStyles.popupText]}>
                {option.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </BottomPopup>
  );
}
