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
import { layoutStyles } from "../../../styles";

export default function ActionsModal({ modalVisible, setModalVisible }) {
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
                  What actions would you like to do?
                </Text>
                <SolidButton
                  backgroundColor={"#f4f4f4"}
                  text={"Add to Logbook"}
                  textColor={"#000000"}
                  onPress={() => setModalVisible(false)}
                  width={"100%"}
                />
                <View style={[styles.actionButtons, layoutStyles.marginTopSm]}>
                  <View style={{ flex: 1, marginRight: 6 }}>
                    <SolidButton
                      backgroundColor={"#f4f4f4"}
                      text={"Share Experience"}
                      textColor={"#000000"}
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 6 }}>
                    <SolidButton
                      backgroundColor={"#f4f4f4"}
                      text={"View on Map"}
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
