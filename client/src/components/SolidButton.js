import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function SolidButton({
  backgroundColor,
  textColor,
  width,
  text,
  onPress,
}) {
  return (
    <Pressable
      style={[
        styling.button,
        { backgroundColor: backgroundColor, width: width },
      ]}
      onPress={onPress}
    >
      <Text style={[styling.buttonMessage, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styling = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
  },
});
