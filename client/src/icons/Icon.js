import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { iconStyles } from "../styles/iconStyles";

export default function Icon({ name, style, spacer, tintColor, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[iconStyles.iconContainer, { marginLeft: spacer }]}
    >
      <SymbolView
        name={name}
        style={{ width: 24, height: 24 }}
        type="monochrome"
        tintColor={!tintColor ? "#000" : tintColor}
      />
    </Pressable>
  );
}
