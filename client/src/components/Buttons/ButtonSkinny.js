import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function ButtonSkinny({
  backgroundColor,
  marginTop,
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
        {
          backgroundColor: backgroundColor,
          width: width,
          marginTop: marginTop,
        },
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
    borderRadius: 12,
  },
  buttonMessage: {
    textAlign: "center",
  },
});
