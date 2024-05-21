import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import CheckBox from "expo-checkbox";

const baseURL = "http://localhost:3001";

export default function SearchItemCard({
  experience,
  isSelected,
  onSelect,
  isPreExisting,
}) {
  const [isChecked, setIsChecked] = useState(isSelected);
  const imageUrl = `${baseURL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 18);
  const capitalizedCategory = capitalizeText(experience.category);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onSelect(experience, !isChecked);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        cardStyles.userCardContainer,
        isPreExisting && styles.disabled,
        isChecked && styles.selected,
      ]}
      disabled={isPreExisting}
    >
      <View style={[layoutStyles.flexRowSpace, styles.card]}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <View>
          <Text>{truncatedTitle}</Text>
          <Text style={{ fontSize: 12, color: "#d4d4d4", marginTop: 2 }}>
            {capitalizedCategory}
          </Text>
        </View>
      </View>
      <CheckBox
        value={isChecked}
        onValueChange={handlePress}
        disabled={isPreExisting}
        style={styles.checkbox}
        color={isSelected ? "#6AB952" : "#d4d4d4"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingLeft: 8,
  },
  selected: {
    backgroundColor: "#f0f0f0",
  },
  disabled: {
    opacity: 0.5,
  },
  checkbox: {
    alignSelf: "center",
    marginRight: 24,
    height: 12,
    width: 12,
    borderRadius: 10,
  },
});
