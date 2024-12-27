import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getImageFromCache,
  saveImageToCache,
} from "../../../utils/cacheHelper";

export default function UserRelationsCard({
  user,
  initialAction,
  onActionPress,
}) {
  const { currentUser } = useAuth();
  const [action, setAction] = useState(initialAction);
  const [profilePictureUri, setProfilePictureUri] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true); // Track loading state for images
  const navigation = useNavigation();

  // Determine the text color based on the action
  const getTextColor = () => {
    if (action === "Following") return "#6AB952"; // Green for Following
    if (action === "Pending") return "#5FC4ED"; // Blue for Pending
    return "#FFFFFF"; // Default white
  };

  useEffect(() => {
    const fetchAndCacheProfilePicture = async () => {
      try {
        const imageKey = `profile_picture_${user._id}`;
        const cachedImageUri = await getImageFromCache(imageKey);

        if (!cachedImageUri) {
          console.log(`Caching profile picture for user: ${user._id}`);
          const cachedUri = await saveImageToCache(
            imageKey,
            user.profilePicture
          );
          setProfilePictureUri(cachedUri);
        } else {
          console.log(
            `Profile picture loaded from cache for user: ${user._id}`
          );
          setProfilePictureUri(cachedImageUri);
        }
      } catch (error) {
        console.error(
          `Error fetching or caching profile picture for user: ${user._id}`,
          error
        );
      } finally {
        setLoadingImage(false);
      }
    };

    fetchAndCacheProfilePicture();
  }, [user._id, user.profilePicture]);

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
        {loadingImage ? (
          <ActivityIndicator
            size="small"
            color="#d4d4d4"
            style={styles.imageMd}
          />
        ) : (
          <Image
            source={{ uri: profilePictureUri }}
            onPress={handleProfilePress}
            style={styles.imageMd}
          />
        )}
        <Pressable style={styles.textContainer} onPress={handleProfilePress}>
          <Text style={styles.primaryText}>{user.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{user.username}
          </Text>
        </Pressable>
        {currentUser._id !== user._id && (
          <View style={styles.actionButtonSpacer}>
            <ButtonSmall
              text={action}
              textColor={getTextColor()}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginTop: 8,
    borderRadius: 8,
  },
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
  actionButtonSpacer: {
    marginRight: 8,
  },
});
