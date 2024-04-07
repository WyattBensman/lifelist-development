import { Pressable, Text, View } from "react-native";
import { ButtonStyling } from "./ButtonStyling";

export default function RedButton({ width, onPress, text }) {
  return (
    <View>
      <Pressable
        style={[
          ButtonStyling.button,
          { backgroundColor: "#C5221F", width: width },
        ]}
        onPress={onPress}
      >
        <Text style={ButtonStyling.buttonMessage}>{text}</Text>
      </Pressable>
    </View>
  );
}
