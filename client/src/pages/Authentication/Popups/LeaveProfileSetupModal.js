import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import CloseButton from "../../../icons/Universal/CloseButton";
import { modalStyles as styles } from "../../../styles/ModalStyling";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../../utils/mutations/userActionsMutations.js";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";
import ButtonOutline from "../../../components/Buttons/ButtonOutline.js";

export default function LeaveProfileSetupModal({
  modalVisible,
  setModalVisible,
  navigation,
}) {
  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      if (data.deleteUser.success) {
        console.log("Okay");
        setModalVisible(false); // Close modal after deletion
        navigation.goBack();
      } else {
        Alert.alert("Error", data.deleteUser.message);
      }
    },
    onError: (err) => {
      Alert.alert("Deletion Error", err.message);
    },
  });

  const handleDeleteUser = () => {
    deleteUser();
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
            <KeyboardAvoidingView
              style={styles.fullWidth}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
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
                      text={"Go Back"}
                      textColor={"#000000"}
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
