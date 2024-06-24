import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function ButtonSolid({
  backgroundColor,
  textColor,
  borderColor,
  width,
  text,
  marginTop,
  onPress,
  icon,
}) {
  return (
    <Pressable
      style={[
        styling.button,
        {
          backgroundColor: backgroundColor,
          width: width,
          marginTop: marginTop,
          borderColor: borderColor,
          borderWidth: borderColor ? 1 : 0,
        },
      ]}
      onPress={onPress}
    >
      {icon && <View style={styling.iconContainer}>{icon}</View>}
      <Text style={[styling.buttonMessage, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styling = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 4,
    height: 36,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonMessage: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  iconContainer: {
    marginRight: 6,
  },
});
