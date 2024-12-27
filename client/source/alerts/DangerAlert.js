import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import styles from "./alertStyles";

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
                <Pressable style={styles.confirmButton} onPress={onConfirm}>
                  <Text style={styles.confirmButtonText}>
                    {confirmButtonText}
                  </Text>
                </Pressable>
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

export default DangerAlert;
