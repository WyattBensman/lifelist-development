import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GreenButton({ width, onClick, text }) {
  return (
    <View>
      <Pressable style={styles.button} onClick={onClick}>
        <Text style={styles.buttonMessage}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#6AB952",
    borderRadius: 8,
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});
