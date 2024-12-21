import { useState, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import UnblockUserModal from "../Popups/UnblockUserModal";
import {
  getImageFromCache,
  saveImageToCache,
} from "../../../utils/cacheHelper";

export default function BlockedUserCard({
  userId,
  fullName,
  username,
  profilePicture,
  onUnblock,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cachedImageUri, setCachedImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = () => setModalVisible(!modalVisible);

  useEffect(() => {
    const cacheProfilePicture = async () => {
      const imageKey = `blocked_user_${userId}`;
      const cachedUri = await getImageFromCache(imageKey);

      if (cachedUri) {
        console.log(`Cached profile picture found for user: ${userId}`);
        setCachedImageUri(cachedUri);
      } else {
        console.log(`Caching profile picture for user: ${userId}`);
        const savedUri = await saveImageToCache(imageKey, profilePicture);
        setCachedImageUri(savedUri);
      }

      setIsLoading(false);
    };

    cacheProfilePicture();
  }, [userId, profilePicture]);

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#d4d4d4" />
        ) : (
          <Image source={{ uri: cachedImageUri }} style={styles.imageMd} />
        )}
        <Pressable style={styles.textContainer}>
          <Text style={styles.primaryText}>{fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{username}
          </Text>
        </Pressable>
        <View style={styles.actionButtonContainer}>
          <ButtonSmall
            text={"Blocked"}
            textColor={"#d4d4d4"}
            backgroundColor={"#252525"}
            onPress={toggleModal}
          />
        </View>
      </View>
      <UnblockUserModal
        modalVisible={modalVisible}
        onClose={toggleModal}
        onUnblock={() => onUnblock(userId)}
      />
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
