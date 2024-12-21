import React, { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import { useLifeList } from "../../../contexts/LifeListContext";

export default function AddShotToExperienceCard({ experience, shotId }) {
  const { updateAssociatedShotsInCache } = useLifeList();
  const [isShotAdded, setIsShotAdded] = useState(false);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 40);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const { _id, associatedShots } = experience;

  // Check if the shot is already associated with the experience
  useEffect(() => {
    setIsShotAdded(associatedShots.some((shot) => shot._id === shotId));
  }, [associatedShots, shotId]);

  const handleAddRemoveShot = async () => {
    try {
      const updatedShots = isShotAdded
        ? associatedShots.filter((shot) => shot._id !== shotId) // Remove the shot
        : [...associatedShots, { _id: shotId }]; // Add the shot

      // Update the cache
      await updateAssociatedShotsInCache(_id, updatedShots);
      setIsShotAdded(!isShotAdded); // Toggle the button state
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
  };

  return (
    <View>
      <Pressable style={styles.listItemContainer}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{truncatedTitle}</Text>
            <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
          </View>
          <Pressable onPress={handleAddRemoveShot}>
            <View
              style={
                isShotAdded
                  ? styles.addedButtonContainer
                  : styles.addButtonContainer
              }
            >
              <Text
                style={
                  isShotAdded ? styles.addedButtonText : styles.addButtonText
                }
              >
                {isShotAdded ? "Added" : "Add"}
              </Text>
            </View>
          </Pressable>
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
    paddingRight: 16,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
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
    color: "#aaa",
    marginTop: 1.5,
  },
  addButtonContainer: {
    backgroundColor: "#252525",
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "500",
  },
  addedButtonContainer: {
    backgroundColor: "#6AB95230",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#6AB95250",
    paddingVertical: 5,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addedButtonText: {
    color: "#6AB952",
    fontSize: 12,
    fontWeight: "500",
  },
});
