import { useState } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import UnblockUserModal from "../Popups/UnblockUserModal";
import { BASE_URL } from "../../../utils/config";

export default function BlockedUserCard({
  userId,
  fullName,
  username,
  profilePicture,
  onUnblock,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const profilePictureUrl = `${BASE_URL}${profilePicture}`;

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
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
