import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";

const FormAlert = ({ visible, onRequestClose, title, subheader, onSave }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue);
      setInputValue(""); // Reset input after saving
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.absolute} onPress={onRequestClose}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        >
          <View style={styles.centeredView}>
            <View>
              <Pressable
                style={styles.modalView}
                onPress={(e) => e.stopPropagation()}
              >
                {title && <Text style={styles.modalHeader}>{title}</Text>}
                {subheader && (
                  <Text style={styles.modalSubheader}>{subheader}</Text>
                )}
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Title" // The placeholder text
                  placeholderTextColor="#aaaaaa"
                  autoFocus={true} // Auto-focus the TextInput when modal opens
                />
                <View style={styles.actionButtons}>
                  <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={onRequestClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullWidth: {
    width: "100%",
  },
  modalView: {
    margin: 24,
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 30,
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
    marginBottom: 4,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSubheader: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    color: "#aaaaaa",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  saveButton: {
    width: "44%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6AB95230",
    borderColor: "#6AB95250",
    borderWidth: 1,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#6AB952",
    fontWeight: "500",
  },
  cancelButton: {
    width: "44%",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaaaaa", // Slightly darker border
    borderWidth: 1,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#aaaaaa", // Matching red tone
    fontWeight: "500",
  },
});

export default FormAlert;
