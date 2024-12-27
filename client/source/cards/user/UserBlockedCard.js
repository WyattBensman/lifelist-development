import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import cardStyles from "../../styles/components/cardStyles";
import DangerAlert from "../../alerts/DangerAlert";
import SmallGreyButton from "../../buttons/SmallGreyButton";

export default function UserBlockedCard({
  userId,
  fullName,
  username,
  profilePicture,
  onUnblock,
}) {
  const [alertVisible, setAlertVisible] = useState(false);

  const toggleAlert = () => setAlertVisible(!alertVisible);

  return (
    <View style={cardStyles.listItemContainer}>
      <View style={cardStyles.contentContainer}>
        <Image source={{ uri: profilePicture }} style={cardStyles.imageMd} />
        <Pressable style={cardStyles.textContainer}>
          <Text style={cardStyles.primaryText}>{fullName}</Text>
          <Text style={cardStyles.secondaryText}>@{username}</Text>
        </Pressable>
        <View style={cardStyles.actionButtonSpacer}>
          <SmallGreyButton text={"Blocked"} onPress={toggleAlert} />
        </View>
      </View>
      <DangerAlert
        visible={alertVisible}
        onRequestClose={toggleAlert}
        title="Unblock User"
        message={`Are you sure you want to unblock ${fullName}?`}
        onConfirm={() => {
          onUnblock(userId); // Perform unblock action
          toggleAlert(); // Close the alert
        }}
      />
    </View>
  );
}
