import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function BlueOutlineButton({ width, onPress, text }) {
  return (
    <Pressable
      style={[
        ButtonStyling.button,
        { borderColor: "#5FC4ED", borderWidth: 1.25, width: width },
      ]}
      onPress={onPress}
    >
      <Text style={[ButtonStyling.buttonMessage, { color: "#5FC4ED" }]}>
        {text}
      </Text>
    </Pressable>
  );
}
