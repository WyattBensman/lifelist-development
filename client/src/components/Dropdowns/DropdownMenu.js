import { View, Pressable, Text, StyleSheet } from "react-native";
import Icon from "../../icons/Icon";

const DropdownMenu = ({ items }) => {
  return (
    <View style={styles.dropdownContainer}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.dropdownItemContainer}
          onPress={item.onPress}
        >
          <Icon name={item.icon} style={item.style} onPress={item.onPress} />
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
    paddingTop: 16,
    zIndex: 1,
    backgroundColor: "#FBFBFE",
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  dropdownLabel: {
    fontSize: 12,
  },
});

export default DropdownMenu;
