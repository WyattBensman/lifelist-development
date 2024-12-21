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
    <View style={styles.listItemContainer}>
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
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
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
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  primaryText: {
    fontWeight: "600",
    marginTop: 4,
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 1.5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
