import React, { useState, useEffect, useRef } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import CheckBox from "expo-checkbox";

export default function SearchItemCard({
  experience,
  isSelected,
  onSelect,
  isPreExisting,
}) {
  const [isChecked, setIsChecked] = useState(isSelected);

  const imageUrl = `${BASE_URL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 30);
  const capitalizedCategory = capitalizeText(experience.subCategory);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    if (!isPreExisting) {
      setIsChecked(!isChecked);
      onSelect(experience, !isChecked);
    }
  };

  return (
    <View style={[styles.listItemContainer, isPreExisting && styles.disabled]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{truncatedTitle}</Text>
            <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
          </View>
          <CheckBox
            value={isChecked}
            onValueChange={handlePress}
            disabled={isPreExisting}
            style={styles.checkbox}
            color={isChecked ? "#6AB952" : "#d4d4d4"}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginTop: 4,
    flex: 1,
    padding: 8,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  pressable: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 1.5,
  },
  checkbox: {
    alignSelf: "center",
    marginRight: 24,
    height: 12,
    width: 12,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: "#f0f0f0",
  },
  disabled: {
    opacity: 0.5,
  },
});
