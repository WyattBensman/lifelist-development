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

const CustomAlert = ({
  visible,
  onRequestClose,
  title,
  message,
  onConfirm,
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
              <Pressable
                style={styles.modalView}
                onPress={(e) => e.stopPropagation()}
              >
                {title && <Text style={styles.modalHeader}>{title}</Text>}
                <Text style={styles.modalMessage}>{message}</Text>
                <View style={styles.actionButtons}>
                  <Pressable style={styles.confirmButton} onPress={onConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </Pressable>
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
  modalHeader: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalMessage: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 16,
    color: "#ccc",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    width: "42.5%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#6AB95280",
  },
  confirmButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    width: "42.5%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E5393580",
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomAlert;
