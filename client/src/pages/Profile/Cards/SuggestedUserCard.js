import React, { useState } from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import { BASE_URL } from "../../../utils/config";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function SuggestedUserCard({
  user,
  initialAction,
  onActionPress,
  isInContacts,
}) {
  const { currentUser } = useAuth();
  const [action, setAction] = useState(initialAction);
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.push("Profile", { userId: user._id });
  };

  const handleActionPress = async () => {
    console.log("Action Button Pressed!");
    const newAction = await onActionPress(
      user._id,
      action,
      user.isProfilePrivate
    );
    setAction(newAction);
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: profilePictureUrl }}
          onPress={handleProfilePress}
          style={styles.imageMd}
        />
        <Pressable style={styles.textContainer} onPress={handleProfilePress}>
          <Text style={styles.primaryText}>{user.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            {isInContacts ? "In your contacts" : `@${user.username}`}
          </Text>
        </Pressable>
        {currentUser._id !== user._id && (
          <View style={styles.actionButtonContainer}>
            <ButtonSmall
              text={action}
              textColor={"#d4d4d4"}
              backgroundColor={"#252525"}
              onPress={handleActionPress}
            />
          </View>
        )}
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
