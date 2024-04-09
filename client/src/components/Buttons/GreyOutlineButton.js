import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function GreyOutlineButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { borderColor: "#B9B9B9", borderWidth: 1.25, width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[ButtonStyling.buttonMessage, { color: "#262828" }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
