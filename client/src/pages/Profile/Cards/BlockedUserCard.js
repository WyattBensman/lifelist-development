import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { layoutStyles } from "../../../styles";
import { useState } from "react";
import UnblockUserModal from "../Popups/UnblockUserModal";

export default function BlockedUserCard() {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const unblockUser = () => {
    console.log("User has been unblocked!"); // Implement actual unblock logic here
    setModalVisible(false);
  };

  return (
    <View style={cardStyling.container}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <View style={[layoutStyles.flex, { flex: 1 }]}>
          <Text
            style={[cardStyling.username, cardStyling.descriptionContainer]}
          >
            Wyatt Bensman
          </Text>
          <Pressable style={styles.followContainer} onPress={toggleModal}>
            <Text style={styles.followText}>Blocked</Text>
          </Pressable>
        </View>
      </View>
      <UnblockUserModal
        modalVisible={modalVisible}
        onClose={toggleModal}
        onUnblock={unblockUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  followContainer: {
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#ececec",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
  followingContainer: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followingText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
});
