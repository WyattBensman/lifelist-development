import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable, Animated } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../styles/components/cardStyles";
import { truncateText, capitalizeText } from "../../utils/commonHelpers";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../icons/Icon";
import { SymbolView } from "expo-symbols";
import { getImageFromFileSystem } from "../../utils/caching/cacheHelpers";
// UDATE USE LIFELIST
import { useLifeList } from "../../../contexts/LifeListContext";
import DangerAlert from "../../alerts/DangerAlert";
import { symbolStyles } from "../../styles/components/symbolStyles";

export default function ExperienceListCard({
  lifeListExperienceId,
  experience,
  editMode,
  onDelete,
  hasAssociatedShots,
}) {
  const navigation = useNavigation();
  const { updateLifeListExperienceInCache } = useLifeList();
  const [isSelected, setIsSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [listStatus, setListStatus] = useState(experience.list);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const truncatedTitle = truncateText(experience.experience.title, 40);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const { _id, associatedShots } = experience;

  useEffect(() => {
    const fetchCachedImage = async () => {
      const cacheKey = `experience_image_${experience._id}`;
      const cachedUri = await getImageFromFileSystem(cacheKey);
      setImageUri(cachedUri || experience.experience.image);
    };
    fetchCachedImage();
  }, [experience]);

  const handlePress = () => {
    if (isEditMode) {
      setIsSelected(!isSelected);
    } else if (hasAssociatedShots) {
      navigation.navigate("LifeListStack", {
        screen: "ViewExperience",
        params: { experienceId: lifeListExperienceId },
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleToggleListStatus = async () => {
    const newListStatus =
      listStatus === "EXPERIENCED" ? "WISHLISTED" : "EXPERIENCED";

    if (listStatus === "EXPERIENCED" && hasAssociatedShots) {
      setIsAlertVisible(true);
      return;
    }

    const previousStatus = listStatus;
    setListStatus(newListStatus);

    try {
      await updateLifeListExperienceInCache({
        lifeListExperienceId: lifeListExperienceId,
        list: newListStatus,
        associatedShots: newListStatus === "WISHLISTED" ? [] : associatedShots,
      });
    } catch (error) {
      console.error("Failed to update list status:", error);
      setListStatus(previousStatus);
    }
  };

  const confirmChangeListStatus = async () => {
    const newListStatus =
      listStatus === "EXPERIENCED" ? "WISHLISTED" : "EXPERIENCED";

    try {
      setListStatus(newListStatus);
      await updateLifeListExperienceInCache({
        lifeListExperienceId,
        list: newListStatus,
        associatedShots: [],
      });
      setIsAlertVisible(false);
    } catch (error) {
      console.error(
        "Failed to update list status or clear associated shots:",
        error
      );
    }
  };

  const handleManageShots = () => {
    navigation.navigate("ManageShots", {
      experienceId: lifeListExperienceId,
      associatedShots,
    });
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isEditMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isEditMode]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={[
          cardStyles.experienceListContainer,
          isSelected && cardStyles.selected,
        ]}
      >
        <View style={cardStyles.contentContainer}>
          <Image source={{ uri: imageUri }} style={cardStyles.imageMd} />
          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
            <View style={cardStyles.secondaryTextContainer}>
              <Text style={cardStyles.secondaryText}>
                {capitalizedCategory}
              </Text>
              {hasAssociatedShots && (
                <SymbolView
                  name="photo.on.rectangle"
                  style={cardStyles.photoIcon}
                  type="monochrome"
                  tintColor="#696969"
                />
              )}
            </View>
          </View>
          {!editMode && (
            <Animated.View
              style={{ marginRight: 16, transform: [{ rotate: rotation }] }}
            >
              <Icon
                name="ellipsis"
                style={symbolStyles.ellipsis}
                tintColor="#696969"
                onPress={toggleEditMode}
              />
            </Animated.View>
          )}
        </View>
        {(isEditMode || editMode) && (
          <View style={cardStyles.optionsContainer}>
            <Icon
              name="trash"
              style={symbolStyles.trash}
              tintColor="#696969"
              onPress={() => onDelete(_id)}
            />
            <View style={cardStyles.buttonsContainer}>
              {listStatus === "EXPERIENCED" && (
                <Pressable
                  style={cardStyles.optionsButton}
                  onPress={handleManageShots}
                >
                  <Text style={cardStyles.optionsText}>
                    {hasAssociatedShots ? "Manage Shots" : "Add Shots"}
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={[
                  cardStyles.optionsButton,
                  cardStyles.spacer,
                  listStatus === "EXPERIENCED"
                    ? cardStyles.experiencedButton
                    : cardStyles.wishListedButton,
                ]}
                onPress={handleToggleListStatus}
              >
                <Text
                  style={[
                    cardStyles.optionsText,
                    listStatus === "EXPERIENCED"
                      ? cardStyles.experiencedColor
                      : cardStyles.wishlistedColor,
                  ]}
                >
                  {listStatus === "EXPERIENCED" ? "Experienced" : "Wish Listed"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
      <DangerAlert
        visible={isAlertVisible}
        onRequestClose={() => setIsAlertVisible(false)}
        message="Are you sure you want to change the list? Your associated shots will be cleared."
        onConfirm={confirmChangeListStatus}
      />
    </View>
  );
}
