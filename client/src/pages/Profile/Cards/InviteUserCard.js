import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import { BASE_URL } from "../../../utils/config";
import { useNavigation } from "@react-navigation/native";

export default function InviteUserCard({ contact }) {
  const profilePictureUrl = contact.imageAvailable
    ? contact.thumbnailPath
    : null;
  const navigation = useNavigation();

  const handleProfilePress = () => {
    // Add navigation to contact profile if needed
  };

  const handleInvitePress = () => {
    // Handle invite action here
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            onPress={handleProfilePress}
            style={styles.imageMd}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
        <Pressable style={styles.textContainer} onPress={handleProfilePress}>
          <Text style={styles.primaryText}>{contact.name}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            {contact.phoneNumbers[0]?.number}
          </Text>
        </Pressable>
        <View style={styles.actionButtonContainer}>
          <ButtonSmall
            text="Invite"
            textColor={"#d4d4d4"}
            backgroundColor={"#252525"}
            onPress={handleInvitePress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 16,
    flex: 1,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 50,
    width: 50,
    borderRadius: 4,
  },
  placeholder: {
    height: 50,
    width: 50,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 1.5,
  },
  actionButtonContainer: {
    borderRadius: 8,
    alignSelf: "center",
  },
});
