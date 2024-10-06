import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";

const OptionsAlert = ({
  visible,
  onRequestClose,
  title,
  button1Text,
  button2Text,
  onButton1Press,
  onButton2Press,
}) => {
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
          intensity={50}
          tint="dark"
          reducedTransparencyFallbackColor="black"
        >
          <View style={styles.centeredView}>
            <KeyboardAvoidingView
              style={styles.fullWidth}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
              <Pressable
                style={styles.modalView}
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={styles.modalHeader}>Options</Text>
                <View style={styles.actionButtons}>
                  {/* First Action Button */}
                  <Pressable style={styles.button} onPress={onButton1Press}>
                    <Text style={styles.buttonText}>{button1Text}</Text>
                  </Pressable>

                  {/* Second Action Button */}
                  <Pressable style={styles.button} onPress={onButton2Press}>
                    <Text style={styles.buttonText}>{button2Text}</Text>
                  </Pressable>

                  {/* Cancel Button */}
                  <Pressable
                    style={styles.cancelButton}
                    onPress={onRequestClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </Pressable>
            </KeyboardAvoidingView>
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
    marginBottom: 16,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  actionButtons: {
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: "100%",
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaaaaa", // Matching green border
    borderWidth: 1,
    marginBottom: 12, // Add margin to separate the buttons
  },
  buttonText: {
    color: "#aaaaaa",
    fontWeight: "500",
  },
  deleteButton: {
    width: "100%",
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B3030", // Transparent green
    borderColor: "#FF3B3050", // Matching green border
    borderWidth: 1,
    marginBottom: 12, // Add margin to separate the buttons
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontWeight: "500",
  },
  cancelButtonText: {
    paddingVertical: 8,
    paddingBottom: 0,
    paddingHorizontal: 16,
    color: "#aaaaaa",
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
  },
});

export default OptionsAlert;
