import { View, Pressable, Text, StyleSheet } from "react-native";
import IconLarge from "../Icons/IconLarge";

const DropdownMenu = ({ items }) => {
  return (
    <View style={styles.dropdownContainer}>
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
    flex: 1,
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 1,
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
});

export default DropdownMenu;
