import React from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";

export default function OptionsAlert({
  visible,
  onRequestClose,
  onRemoveFromAlbum,
  onDeleteShot,
}) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* Remove from Album Button */}
          <Pressable
            style={[styles.button, { marginBottom: 8 }]}
            onPress={onRemoveFromAlbum}
          >
            <Text style={styles.buttonText}>Remove from Camera Album</Text>
          </Pressable>

          {/* Delete Camera Shot Button */}
          <Pressable
            style={[styles.button, { marginBottom: 16 }]}
            onPress={onDeleteShot}
          >
            <Text style={styles.buttonText}>Delete Camera Shot</Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable onPress={onRequestClose}>
            <Text style={{ color: "#d4d4d4" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay
  },
  alertBox: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    width: "85%", // Adjust width to make it fit better
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20, // Adjusted spacing for better layout
  },
  button: {
    paddingVertical: 9, // Adjusted padding for a better button size
    borderRadius: 8, // Same as your input styling
    backgroundColor: "#252525", // Dark background for buttons
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Full width buttons
  },
  buttonText: {
    color: "#fff",
  },
});
