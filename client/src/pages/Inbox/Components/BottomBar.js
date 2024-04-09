import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import GalleryIcon from "../Icons/GalleryIcon";

export default function BottomBar() {
  const [message, setMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
    >
      <View
        style={[
          styles.container,
          keyboardVisible && styles.containerKeyboardActive,
        ]}
      >
        <TouchableOpacity style={styles.iconContainer}>
          <GalleryIcon />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          style={styles.sendContainer}
          onPress={() => console.log("Send message:", message)}
        >
          {/* Implement your send icon or logic here */}
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 25,
    borderTopColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
  },
  containerKeyboardActive: {
    paddingBottom: 0,
  },
  iconContainer: {
    marginRight: 20,
    marginLeft: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#D4D4D4",
  },
  sendContainer: {
    marginLeft: 20,
    marginRight: 5,
    marginBottom: 10,
  },
});
