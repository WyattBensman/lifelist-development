import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

export default function AddUpcomingExperienceModal({
  modalVisible,
  setModalVisible,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
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
              <TouchableOpacity onPress={() => console.log("Discard")}>
                <Text>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Add Experience")}>
                <Text>Add Experience</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
