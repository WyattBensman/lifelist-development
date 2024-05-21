import React, { useState } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import {
  truncateText,
  capitalizeText,
  capitalizeTextNoSlice,
} from "../../../utils/utils";
import SymbolButtonSm from "../../../icons/SymbolButtonSm";

const baseURL = "http://localhost:3001";

export default function ListItemCard({ experience, editMode }) {
  const [isSelected, setIsSelected] = useState(false);
  const imageUrl = `${baseURL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 18);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const capitalizedList = capitalizeTextNoSlice(experience.list);

  const handlePress = () => {
    if (editMode) {
      setIsSelected(!isSelected);
    }
  };

  const listStyle =
    experience.list === "EXPERIENCED"
      ? styles.experiencedText
      : styles.wishlistedText;

  return (
    <Pressable
      onPress={editMode ? handlePress : null}
      style={[cardStyles.userCardContainer, isSelected && styles.selected]}
    >
      <View style={layoutStyles.flexRowSpace}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <View>
          <Text>{truncatedTitle}</Text>
          <Text style={{ fontSize: 12, color: "#d4d4d4", marginTop: 2 }}>
            {capitalizedCategory}
          </Text>
        </View>
      </View>
      {editMode && (
        <View style={[layoutStyles.flexRowSpace, layoutStyles.marginRightMd]}>
          <View style={[layoutStyles.flexRow, layoutStyles.marginRightMd]}>
            <Text style={[{ marginRight: 4 }, listStyle]}>
              {capitalizedList}
            </Text>
            <SymbolButtonSm
              name="arrow.up.and.down"
              style={{
                height: 10,
                width: 10,
                marginTop: 4,
                marginRight: 2,
              }}
              tintColor={"#d4d4d4"}
            />
          </View>
          <SymbolButtonSm
            name="trash"
            onPress={() => console.log("Delete item")}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "#f0f0f0",
  },
  experiencedText: {
    color: "#6AB952",
  },
  wishlistedText: {
    color: "#5FC4ED",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6AB952",
  },
  checkboxUnchecked: {
    backgroundColor: "#ffffff",
  },
});
