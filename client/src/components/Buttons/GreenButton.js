import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function GreenButton({ width, onPress, text }) {
  return (
    <Pressable
      style={[
        ButtonStyling.button,
        { backgroundColor: "#6AB952", width: width },
      ]}
      onPress={onPress}
    >
      <Text style={ButtonStyling.buttonMessage}>{text}</Text>
    </Pressable>
  );
}
