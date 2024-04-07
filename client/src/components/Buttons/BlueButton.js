import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function BlueButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { backgroundColor: "#5FC4ED", width: width },
        ]}
        onPress={onPress}
      >
        <Text style={ButtonStyling.buttonMessage}>{text}</Text>
      </Pressable>
    </View>
  );
}
