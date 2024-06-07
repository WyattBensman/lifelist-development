import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";

export default function IconStatic({
  name,
  style,
  spacer,
  tintColor,
  onPress,
}) {
  return (
    <Pressable onPress={onPress}>
      <SymbolView
        name={name}
        style={[style, { marginLeft: spacer }]}
        type="monochrome"
        tintColor={!tintColor ? "#262828" : tintColor}
      />
    </Pressable>
  );
}
