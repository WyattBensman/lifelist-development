import React from "react";
import { Modal, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { modalStyles as styles } from "../../../styles/ModalStyling";
import SolidButton from "../../../components/SolidButton";
import OutlinedButton from "../../../components/OutlinedButton";

export default function ActionModal({ modalVisible, setModalVisible }) {
  return (
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
            <Text style={styles.modalHeader}>What would you like to do?</Text>
            <View style={{ marginBottom: 8 }}>
              <SolidButton
                backgroundColor="#6AB952"
                text="Add Experiences"
                textColor="#ffffff"
                width={300}
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <OutlinedButton
                text="Edit Experiences"
                borderColor="#5FC4ED"
                textColor="#5FC4ED"
                width={300}
              />
            </View>
            <OutlinedButton
              text="Return"
              borderColor="#d4d4d4"
              textColor="#d4d4d4"
              onPress={() => setModalVisible(false)}
              width={300}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
