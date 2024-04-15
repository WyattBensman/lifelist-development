import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function ButtonSkinny({
  backgroundColor,
  textColor,
  width,
  text,
  style,
  onPress,
}) {
  return (
    <Pressable
      style={[
        styling.button,
        { backgroundColor: backgroundColor, width: width },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styling.buttonMessage, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styling = StyleSheet.create({
  button: {
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
  },
});