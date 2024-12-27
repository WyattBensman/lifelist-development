import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { BASE_URL } from "../../../utils/config";
import IconStatic from "../../../components/Icons/IconStatic";
import { iconStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";

export default function ParticipantCard({ participant, onRequestClose }) {
  const navigation = useNavigation();
  const profilePictureUrl = `${BASE_URL}${participant.profilePicture}`;

  const handleProfilePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: participant._id },
    });
    onRequestClose();
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={handleProfilePress} style={styles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{participant.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{participant.username}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 48,
    width: 48,
    borderRadius: 4,
    backgroundColor: "#252525", // Fallback background color
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 2,
  },
  iconContainer: {
    marginRight: 16,
  },
});
