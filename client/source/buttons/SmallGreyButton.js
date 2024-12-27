import { Pressable, Text } from "react-native";
import { buttonStyles } from "../styles/components/buttonStyles";

export default function SmallGreyButton({ text, textColor, onPress }) {
  return (
    <Pressable onPress={onPress} style={buttonStyles.smallGreyButton}>
      <Text
        style={[
          buttonStyles.smallButtonText,
          textColor ? { color: textColor } : "#fff",
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
