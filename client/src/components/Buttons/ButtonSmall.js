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
    width: 75,
    borderRadius: 4,
    paddingVertical: 5,
    marginHorizontal: 3,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 11,
    color: "#f4f4f4",
  },
});
