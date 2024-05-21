import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function SymbolButtonLg({ name, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={styles.symbolContainer}>
      <SymbolView
        name={name}
        type="monochrome"
        tintColor="#262828"
        style={[styles.symbol, style]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  symbolContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  symbol: {
    width: 28,
  },
});
