import React, { useState } from "react";
import { Modal, Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import CloseButton from "../../../icons/Universal/CloseButton";
import { modalStyles as styles } from "../../../styles/ModalStyling";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";
import ButtonOutline from "../../../components/Buttons/ButtonOutline.js";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../../utils/mutations/userActionsMutations.js";

export default function LeaveProfileSetupModal({
  modalVisible,
  setModalVisible,
  navigation,
}) {
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      AuthService.logout(); // Clear authentication data
      navigation.popToTop(); // Go back to the top of the navigation stack or adjust as necessary
      setModalVisible(false); // Close the modal after the operation
    },
    onError: (err) => {
      console.error("Error deleting user:", err.message);
      alert("Failed to leave setup: " + err.message);
    },
  });

  const handleDeleteUser = async () => {
    await deleteUser(); // Executes the mutation
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <CloseButton />
              </Pressable>
              <Text style={[styles.modalHeader, { textAlign: "center" }]}>
                Are you sure you don't want to finish setting up your account?
                All progress will be lost.
              </Text>
              <View style={styles.actionButtons}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <ButtonOutline
                    borderColor={"red"}
                    textColor={"red"}
                    text={"Exit Setup"}
                    onPress={handleDeleteUser}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 4 }}>
                  <ButtonSolid
                    backgroundColor={"#f4f4f4"}
                    text={"Dismiss"}
                    textColor={"#000000"}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

{
  /* <View style={styles.actionButtons}>
  <View style={{ flex: 1, marginRight: 4 }}>
    <ButtonOutline
      borderColor={"red"}
      textColor={"red"}
      text={"Exit Setup"}
      onPress={handleDeleteUser}
      style={{ marginRight: 4 }}
    />
  </View>
  <View style={{ flex: 1, marginLeft: 4 }}>
    <ButtonSolid
      backgroundColor={"#f4f4f4"}
      text={"Go Back"}
      textColor={"#000000"}
      onPress={() => setModalVisible(false)}
      style={{ marginLeft: 4 }}
    />
  </View>
</View>; */
}
