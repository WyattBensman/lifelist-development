import { Pressable, StyleSheet, Text } from "react-native";

export default function ButtonSmall({ text, textColor, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1c1c1c",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#FFFFFF",
  },
});

/* const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 12,
    color: "#aaa",
  },
}); */
