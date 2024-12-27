import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable, Animated, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { cardStyles, iconStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import IconStatic from "../../../components/Icons/IconStatic";
import { SymbolView } from "expo-symbols";
import { getImageFromFileSystem } from "../../../utils/newCacheHelper";
import { useLifeList } from "../../../contexts/LifeListContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { symbolStyles } from "../../../../source/styles/components/symbolStyles";

export default function ListItemCard({
  lifeListExperienceId,
  experience,
  editMode,
  onDelete,
  hasAssociatedShots,
}) {
  const navigation = useNavigation();
  const { updateLifeListExperienceInCache } = useLifeList(); // Context method for updates
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
      // Pass the updated item directly
      await updateLifeListExperienceInCache({
        lifeListExperienceId: lifeListExperienceId,
        list: newListStatus,
        associatedShots: newListStatus === "WISHLISTED" ? [] : associatedShots,
      });
    } catch (error) {
      console.error("Failed to update list status:", error);
      setListStatus(previousStatus); // Rollback UI update on failure
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
        style={[styles.listItemContainer, isSelected && styles.selected]}
      >
        <View style={styles.contentContainer}>
          <Image source={{ uri: imageUri }} style={styles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{truncatedTitle}</Text>
            <View style={styles.secondaryTextContainer}>
              <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
              {hasAssociatedShots && (
                <SymbolView
                  name="photo.on.rectangle"
                  style={styles.photoIcon}
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
                tintColor={"#696969"}
                style={symbolStyles.ellipsis}
                noFill={true}
                onPress={toggleEditMode}
              />
            </Animated.View>
          )}
        </View>
        {(isEditMode || editMode) && (
          <View style={styles.optionsContainer}>
            <IconStatic
              name="trash"
              style={symbolStyles.trash}
              tintColor={"#696969"}
              onPress={() => onDelete(_id)}
            />
            <View style={styles.buttonsContainer}>
              {listStatus === "EXPERIENCED" && (
                <Pressable
                  style={styles.optionsButton}
                  onPress={handleManageShots}
                >
                  <Text style={styles.optionsText}>
                    {hasAssociatedShots ? "Manage Shots" : "Add Shots"}
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={[
                  styles.optionsButton,
                  styles.spacer,
                  listStatus === "EXPERIENCED"
                    ? styles.experiencedButton
                    : styles.wishListedButton,
                ]}
                onPress={handleToggleListStatus}
              >
                <Text
                  style={[
                    styles.optionsText,
                    listStatus === "EXPERIENCED"
                      ? styles.experiencedColor
                      : styles.wishlistedColor,
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
    marginLeft: 12,
  },
  imageMd: {
    height: 48,
    width: 48,
    borderRadius: 4,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  secondaryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 2,
  },
  photoIcon: {
    marginLeft: 6,
    width: 15,
    height: 12.04,
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingLeft: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  optionsButton: {
    borderWidth: 1,
    borderColor: "#696969",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 32,
  },
  optionsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  spacer: {
    marginLeft: 8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rotatedEllipsis: {
    transform: [{ rotate: "90deg" }],
  },
  experiencedColor: {
    color: "#6AB952",
  },
  wishlistedColor: {
    color: "#5FC4ED",
  },
  experiencedButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  wishListedButton: {
    backgroundColor: "#5FC4ED30",
    borderWidth: 1,
    borderColor: "#5FC4ED50",
  },
});
