import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function IconHeader({ name, onPress, style, tintColor }) {
  return (
    <Pressable onPress={onPress} style={styles.symbolContainer}>
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
  symbolContainer: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    height: 27,
    aspectRatio: 1,
  },
});
