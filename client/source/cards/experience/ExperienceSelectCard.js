import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../styles/components/cardStyles";
import { truncateText, capitalizeText } from "../../utils/commonHelpers";
import { useLifeList } from "../../../contexts/LifeListContext";
import SmallGreyButton from "../../buttons/SmallGreyButton";
import DangerAlert from "../../alerts/DangerAlert";

export default function ExperienceSelectCard({ experience, shotId }) {
  const { updateAssociatedShotsInCache } = useLifeList();
  const [isShotAdded, setIsShotAdded] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const imageUrl = experience.experience.image;
  const truncatedTitle = truncateText(experience.experience.title, 40);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const { _id, associatedShots } = experience;

  useEffect(() => {
    setIsShotAdded(associatedShots.some((shot) => shot._id === shotId));
  }, [associatedShots, shotId]);

  const handleAddRemoveShot = async () => {
    try {
      const updatedShots = isShotAdded
        ? associatedShots.filter((shot) => shot._id !== shotId)
        : [...associatedShots, { _id: shotId }];

      await updateAssociatedShotsInCache(_id, updatedShots);
      setIsShotAdded(!isShotAdded);
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
  };

  const confirmRemoveShot = async () => {
    try {
      const updatedShots = associatedShots.filter(
        (shot) => shot._id !== shotId
      );
      await updateAssociatedShotsInCache(_id, updatedShots);
      setIsShotAdded(false); // Ensure the button updates correctly
      setIsAlertVisible(false); // Close the alert
    } catch (error) {
      console.error("Failed to remove the shot:", error);
    }
  };

  const getTextColor = () => (isShotAdded ? "#6AB952" : "#fff");

  const handleActionPress = () => {
    if (isShotAdded) {
      setIsAlertVisible(true); // Show DangerAlert if removing
    } else {
      handleAddRemoveShot(); // Directly add the shot
    }
  };

  return (
    <>
      <Pressable style={cardStyles.listItemContainer}>
        <View style={cardStyles.contentContainer}>
          {/* Experience Image */}
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />

          {/* Text Content */}
          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
            <Text style={cardStyles.secondaryText}>{capitalizedCategory}</Text>
          </View>

          {/* Add/Remove Button */}
          <View style={cardStyles.actionButtonSpacer}>
            <SmallGreyButton
              text={isShotAdded ? "Added" : "Add"}
              textColor={getTextColor()}
              onPress={handleActionPress}
            />
          </View>
        </View>
      </Pressable>

      {/* DangerAlert */}
      <DangerAlert
        visible={isAlertVisible}
        onRequestClose={() => setIsAlertVisible(false)}
        message="Are you sure you want to remove this shot?"
        onConfirm={confirmRemoveShot}
      />
    </>
  );
}
