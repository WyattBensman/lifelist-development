import React from "react";
import { Image, StyleSheet, View, Dimensions, Pressable } from "react-native";
import { Checkbox } from "expo-checkbox";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;
const baseURL = "http://localhost:3001";

export default function CollageCard({ collage, isSelected, onCheckboxToggle }) {
  const imageUrl = `${baseURL}${collage.coverImage}`;

  return (
    <Pressable onPress={() => onCheckboxToggle(collage._id)}>
      <View style={styles.container}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {isSelected !== undefined && onCheckboxToggle && (
          <Checkbox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(collage._id)}
            color={isSelected ? "#6AB952" : "#d4d4d4"}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageWidth,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
});
