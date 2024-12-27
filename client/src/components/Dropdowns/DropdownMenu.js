import { View, Pressable, Text, StyleSheet } from "react-native";
import IconLarge from "../Icons/IconLarge";

const DropdownMenu = ({ items, containerStyle }) => {
  return (
    <View style={[styles.dropdownContainer, containerStyle]}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.dropdownItemContainer}
          onPress={item.onPress}
        >
          <IconLarge
            name={item.icon}
            style={item.style}
            tintColor={item.tintColor}
            backgroundColor={item.backgroundColor}
            onPress={item.onPress}
          />
          <Text style={styles.dropdownLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#121212",
    padding: 24,
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100, // Set a fixed width for each dropdown item
  },
  dropdownLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
});

export default DropdownMenu;
