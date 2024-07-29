import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { cardStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import {
  ADD_SHOT_TO_EXPERIENCE,
  REMOVE_SHOT_FROM_EXPERIENCE,
} from "../../../utils/mutations";

export default function AddShotToExperienceCard({ experience, shotId }) {
  const [isShotAdded, setIsShotAdded] = useState(false);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 40);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const { _id, associatedShots } = experience;

  const [addShotToExperience] = useMutation(ADD_SHOT_TO_EXPERIENCE);
  const [removeShotFromExperience] = useMutation(REMOVE_SHOT_FROM_EXPERIENCE);

  useEffect(() => {
    setIsShotAdded(associatedShots.some((shot) => shot._id === shotId));
  }, [associatedShots, shotId]);

  const handleAddRemoveShot = async () => {
    try {
      if (isShotAdded) {
        await removeShotFromExperience({
          variables: {
            experienceId: _id,
            shotId: shotId,
          },
        });
      } else {
        await addShotToExperience({
          variables: {
            experienceId: _id,
            shotId: shotId,
          },
        });
      }
      setIsShotAdded(!isShotAdded);
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
                  : styles.buttonContainer
              }
            >
              <Text
                style={isShotAdded ? styles.addedButtonText : styles.buttonText}
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
    color: "#696969",
    marginTop: 1.5,
  },
  buttonContainer: {
    backgroundColor: "#696969",
    marginRight: 8,
    borderRadius: 16,
  },
  buttonText: {
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: "500",
    color: "#6AB952",
    fontSize: 12,
  },
  addedButtonContainer: {
    backgroundColor: "#6AB952",
    marginRight: 8,
    borderRadius: 16,
  },
  addedButtonText: {
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: "500",
    color: "#fff",
    fontSize: 12,
  },
});
