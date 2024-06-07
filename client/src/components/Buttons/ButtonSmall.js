import { Pressable, StyleSheet, Text } from "react-native";

export default function ButtonSmall({
  text,
  backgroundColor,
  textColor,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.buttonContainer, { backgroundColor: backgroundColor }]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ececec",
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 12,
  },
});
