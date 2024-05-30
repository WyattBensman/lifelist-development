import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function TaggedUsersIcon({ onPress, tintColor }) {
  return (
    <Pressable onPress={onPress} style={styles.symbolContainer}>
      <SymbolView
        name="tag"
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
    width: 22.18,
    height: 22.8,
  },
});
