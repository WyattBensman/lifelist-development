import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function GreyButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { backgroundColor: "#D4D4D4", width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[ButtonStyling.buttonMessage, { color: "000000" }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
