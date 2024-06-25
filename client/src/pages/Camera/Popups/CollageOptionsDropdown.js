import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "../../../components/Icons/Icon";

export default function CollageOptionsDropdown({ isVisible, onClose }) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        <Pressable style={styles.item} onPress={() => console.log("Add to")}>
          <Text style={styles.itemText}>Add to</Text>
          <Icon name="plus" style={styles.icon} />
        </Pressable>
        <Pressable style={styles.item} onPress={() => console.log("Submit")}>
          <Text style={styles.itemText}>Submit</Text>
          <Icon name="submit" style={styles.icon} />
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => console.log("Add sticker")}
        >
          <Text style={styles.itemText}>Add sticker</Text>
          <Icon name="sticker" style={styles.icon} />
        </Pressable>
        <Pressable style={styles.item} onPress={() => console.log("More")}>
          <Text style={styles.itemText}>More</Text>
          <Icon name="more" style={styles.icon} />
        </Pressable>
        <Pressable style={styles.item} onPress={() => console.log("Tag")}>
          <Text style={styles.itemText}>Tag</Text>
          <Icon name="tag" style={styles.icon} />
        </Pressable>
        <Pressable style={styles.item} onPress={() => console.log("Delete")}>
          <Text style={[styles.itemText, styles.deleteText]}>Delete</Text>
          <Icon name="trash" style={[styles.icon, styles.deleteIcon]} />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    margin: 0,
    paddingTop: 75, // Adjust this to position it correctly
  },
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    margin: 20,
    paddingVertical: 10,
    width: 300,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteText: {
    color: "red",
  },
  icon: {
    fontSize: 20,
    color: "#fff",
  },
  deleteIcon: {
    color: "red",
  },
});
