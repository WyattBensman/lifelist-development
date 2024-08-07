import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function SymbolButtonSm({ name, onPress, style, tintColor }) {
  return (
    <Pressable onPress={onPress}>
      <SymbolView
        name={name}
        style={!style ? styles.symbol : style}
        type="monochrome"
        tintColor={!tintColor ? "#262828" : tintColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  symbol: {
    width: 20,
    height: 20,
  },
});
