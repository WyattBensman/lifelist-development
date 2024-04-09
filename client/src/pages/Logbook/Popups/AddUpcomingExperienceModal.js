import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import SolidButton from "../../../components/SolidButton";
import CloseButton from "../../../icons/Universal/CloseButton";

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
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 25,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 17.5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 8,
    borderColor: "#D4D4D4",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
