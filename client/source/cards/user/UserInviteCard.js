import React from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import cardStyles from "../../styles/components/cardStyles";
import SmallGreyButton from "../../buttons/SmallGreyButton";

export default function UserInviteCard({ contact }) {
  const profilePictureUrl = contact.imageAvailable
    ? contact.thumbnailPath
    : null;

  const handleProfilePress = () => {
    // Add navigation to contact profile if needed
    console.log("Profile pressed for", contact.name);
  };

  const handleInvitePress = () => {
    // Handle invite action here
    console.log("Invite button pressed for", contact.name);
  };

  return (
    <View style={cardStyles.listItemContainer}>
      <View style={cardStyles.contentContainer}>
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            style={cardStyles.imageMd}
          />
        ) : (
          <View style={cardStyles.placeholder} />
        )}
        <Pressable
          style={cardStyles.textContainer}
          onPress={handleProfilePress}
        >
          <Text style={cardStyles.primaryText}>{contact.name}</Text>
          <Text style={cardStyles.secondaryText}>
            {contact.phoneNumbers[0]?.number}
          </Text>
        </Pressable>
        <View style={cardStyles.actionButtonSpacer}>
          <SmallGreyButton
            text="Invite"
            textColor={"#6AB952"}
            onPress={handleInvitePress}
          />
        </View>
      </View>
    </View>
  );
}
