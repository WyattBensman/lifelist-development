import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function GreenOutlineButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { borderColor: "#6AB952", borderWidth: 1.25, width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[ButtonStyling.buttonMessage, { color: "#6AB952" }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
