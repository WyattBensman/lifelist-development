import { View, Pressable, Text, StyleSheet } from "react-native";
import SymbolButtonLg from "../../icons/SymbolButtonLg";

const DropdownMenu = ({ items }) => {
  return (
    <View style={styles.dropdownContainer}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.dropdownItemContainer}
          onPress={item.onPress}
        >
          <SymbolButtonLg
            name={item.icon}
            style={item.style}
            onPress={item.onPress}
          />
          <Text style={styles.dropdownItem}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
    zIndex: 1,
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  dropdownItem: {
    padding: 4,
    fontSize: 12,
  },
});

export default DropdownMenu;
