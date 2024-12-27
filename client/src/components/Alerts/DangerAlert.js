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

const DangerAlert = ({
  visible,
  onRequestClose,
  title,
  message,
  onConfirm,
  onCancel = onRequestClose,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
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
            <Pressable
              style={styles.modalView}
              onPress={(e) => e.stopPropagation()}
            >
              {title && <Text style={styles.modalHeader}>{title}</Text>}
              <Text style={styles.modalSubheader}>{message}</Text>
              <View style={styles.actionButtons}>
                {/* Confirm Button */}
                <Pressable style={styles.confirmButton} onPress={onConfirm}>
                  <Text style={styles.confirmButtonText}>
                    {confirmButtonText}
                  </Text>
                </Pressable>
                {/* Cancel Button */}
                <Pressable style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>
                    {cancelButtonText}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  confirmButton: {
    width: "44%",
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5393530", // Transparent red
    borderColor: "#E5393550", // Red border
    borderWidth: 1,
  },
  confirmButtonText: {
    textAlign: "center",
    color: "#E53935", // Red text
    fontWeight: "500",
  },
  cancelButton: {
    width: "44%",
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaaaaa",
    borderWidth: 1,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#aaaaaa",
    fontWeight: "500",
  },
});

export default DangerAlert;
