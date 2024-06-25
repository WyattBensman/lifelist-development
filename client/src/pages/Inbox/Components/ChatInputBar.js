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
import IconStatic from "../../../components/Icons/IconStatic";
import { iconStyles } from "../../../styles";

export default function ChatInputBar({ onSendMessage }) {
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

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <View
        style={[
          styles.container,
          keyboardVisible && styles.containerKeyboardActive,
        ]}
      >
        <Pressable style={styles.iconContainer}>
          <IconStatic
            name="photo.on.rectangle"
            style={iconStyles.sendImage}
            weight="bold"
            onPress={() => console.log("Gallery Icon Pressed")}
          />
        </Pressable>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#696969"
        />
        <Pressable style={styles.sendContainer} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#121212",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
    borderTopColor: "#D4D4D4",
    borderTopWidth: 1,
    backgroundColor: "#1C1C1C",
  },
  containerKeyboardActive: {
    paddingBottom: 0,
  },
  iconContainer: {
    marginRight: 16,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#252525",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#FFFFFF",
  },
  sendContainer: {
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#6AB952",
    fontWeight: "600",
  },
});
