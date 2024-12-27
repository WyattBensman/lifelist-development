import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import styles from "./alertStyles";

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
        <BlurView style={styles.absolute} blurType="dark" blurAmount={10}>
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
                  placeholder="Title"
                  placeholderTextColor="#aaaaaa"
                  autoFocus={true}
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

export default FormAlert;
