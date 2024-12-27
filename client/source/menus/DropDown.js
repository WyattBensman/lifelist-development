import React from "react";
import { View, Pressable, Text } from "react-native";
import DropdownIcon from "../icons/DropdownIcon";
import { menuStyles } from "../styles/menuStyles";

const DropdownMenu = ({ items, containerStyle }) => {
  return (
    <View style={[menuStyles.dropdownContainer, containerStyle]}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={menuStyles.dropdownItemContainer}
          onPress={item.onPress}
        >
          <DropdownIcon
            name={item.icon}
            style={item.style}
            tintColor={item.tintColor}
            weight={item.weight || "regular"}
            onPress={item.onPress}
          />
          <Text style={menuStyles.dropdownLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default DropdownMenu;
