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
    <View>
      <Pressable
        style={[
          styling.button,
          { borderColor: borderColor, borderWidth: 1, width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[styling.buttonMessage, { color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}

const styling = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 4,
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
  },
});
