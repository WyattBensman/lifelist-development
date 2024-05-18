import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function SymbolButtonLg({ name, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <SymbolView
        name={name}
        style={styles.symbol}
        type="monochrome"
        tintColor="#262828"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  symbol: {
    width: 32,
    height: 32,
  },
});
