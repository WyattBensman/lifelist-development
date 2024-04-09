import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import SolidButton from "../../../components/SolidButton";
import CloseButton from "../../../icons/Universal/CloseButton";
import { modalStyles as styles } from "../../../styles/ModalStyling";

export default function AddUpcomingExperienceModal({
  modalVisible,
  setModalVisible,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

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
                <Text style={styles.modalHeader}>Add Upcoming Experience</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setName}
                  value={name}
                  placeholder="Name of Experience"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setDate}
                  value={date}
                  placeholder="Date"
                />
                <View style={styles.actionButtons}>
                  <View style={{ flex: 1, marginRight: 2 }}>
                    <SolidButton
                      backgroundColor={"#f4f4f4"}
                      text={"Discard"}
                      textColor={"#000000"}
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 2 }}>
                    <SolidButton
                      backgroundColor={"#5FC4ED"}
                      text={"Add Experience"}
                      textColor={"#FFFFFF"}
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
