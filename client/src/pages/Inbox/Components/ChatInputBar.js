import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from "react-native";
import GalleryIcon from "../Icons/GalleryIcon";
import { formStyling } from "../../../styles/FormStyling";

export default function ChatInputBar() {
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
        <Pressable style={styles.iconContainer}>
          <GalleryIcon />
        </Pressable>
        <TextInput
          style={formStyling.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Pressable
          style={styles.sendContainer}
          onPress={() => console.log("Send message:", message)}
        >
          <Text>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 25,
    borderTopColor: "#D4D4D4",
    borderTopWidth: 1,
  },
  containerKeyboardActive: {
    paddingBottom: 0,
  },
  iconContainer: {
    marginRight: 16,
    height: 30,
  },
  sendContainer: {
    marginLeft: 16,
    height: 30,
  },
});
