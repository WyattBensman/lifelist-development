import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function RedOutlineButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { borderColor: "#C5221F", borderWidth: 1.25, width: width },
        ]}
        onPress={onPress}
      >
        <Text style={[ButtonStyling.buttonMessage, { color: "#C5221F" }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
