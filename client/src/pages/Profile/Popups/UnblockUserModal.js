import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import SolidButton from "../../../components/SolidButton";
import CloseButton from "../../../icons/Universal/CloseButton";
import { modalStyles as styles } from "../../../styles/ModalStyling";
import OutlinedButton from "../../../components/OutlinedButton";

export default function UnblockUserModal({ modalVisible, onClose, onUnblock }) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onClose}
      >
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable style={[styles.buttonClose]} onPress={onClose}>
                <CloseButton />
              </Pressable>
              <Text style={[styles.modalHeader, { textAlign: "center" }]}>
                Are you sure you want to unblock this user?
              </Text>
              <View style={styles.actionButtons}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <OutlinedButton
                    borderColor={"red"}
                    textColor={"red"}
                    text={"Unblock User"}
                    onPress={onUnblock}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 4 }}>
                  <SolidButton
                    backgroundColor={"#f4f4f4"}
                    text={"Discard"}
                    textColor={"#000000"}
                    onPress={onClose}
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
