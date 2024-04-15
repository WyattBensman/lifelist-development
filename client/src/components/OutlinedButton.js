import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function OutlinedButton({
  borderColor,
  textColor,
  width,
  text,
  onPress,
}) {
  return (
    <Pressable
      style={[
        styling.button,
        {
          borderColor: borderColor,
          borderWidth: 1,
          width: width,
        },
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
    paddingVertical: 9,
    borderRadius: 4,
    height: 36,
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
  },
});
