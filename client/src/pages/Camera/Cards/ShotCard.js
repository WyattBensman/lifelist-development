import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { fetchCachedImageUri } from "../../../utils/cacheHelper";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3;
const shotHeight = (shotWidth * 3) / 2;

export default function ShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
  navigation,
  index,
}) {
  const [cachedImageUri, setCachedImageUri] = useState(null);

  useEffect(() => {
    // Fetch or cache the image URI
    const fetchImage = async () => {
      const uri = await fetchCachedImageUri(
        `camera_shot_${shot._id}`,
        shot.image
      );
      setCachedImageUri(uri);
    };
    fetchImage();
  }, [shot._id, shot.image]);

  if (!cachedImageUri) return null; // Render nothing while loading

  return (
    <Pressable
      onPress={() => navigation.navigate("ViewShot", { shotId: shot._id })}
      style={[
        styles.container,
        {
          marginRight: (index + 1) % 3 === 0 ? 0 : spacing,
        },
      ]}
    >
      <View style={styles.shotContainer}>
        <Image source={{ uri: cachedImageUri }} style={styles.shotImage} />
        {isSelected !== undefined && onCheckboxToggle && (
          <Checkbox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(shot._id)}
            color={isSelected ? "#6AB952" : "#d4d4d4"}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
  },
  shotContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  shotImage: {
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
