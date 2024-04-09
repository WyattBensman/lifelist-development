import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function RedOutlineButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { borderColor: "#DB302D", borderWidth: 1.25, width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[ButtonStyling.buttonMessage, { color: "#DB302D" }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
