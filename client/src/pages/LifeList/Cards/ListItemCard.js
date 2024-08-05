import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Text,
  View,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useMutation } from "@apollo/client";
import { cardStyles, iconStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import {
  UPDATE_LIFELIST_EXPERIENCE_LIST_STATUS,
  UPDATE_ASSOCIATED_SHOTS,
} from "../../../utils/mutations";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import IconStatic from "../../../components/Icons/IconStatic";
import CustomAlert from "../../../components/Alerts/CustomAlert";
import { SymbolView } from "expo-symbols"; // Import SymbolView

export default function ListItemCard({ experience, editMode, onDelete }) {
  const navigation = useNavigation();
  const [isSelected, setIsSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [listStatus, setListStatus] = useState(experience.list);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 40);
  const capitalizedCategory = capitalizeText(experience.experience.subCategory);
  const { _id, associatedShots } = experience;

  const [updateListStatus] = useMutation(
    UPDATE_LIFELIST_EXPERIENCE_LIST_STATUS
  );
  const [updateShots] = useMutation(UPDATE_ASSOCIATED_SHOTS);

  const handlePress = () => {
    if (isEditMode) {
      setIsSelected(!isSelected);
    } else if (associatedShots && associatedShots.length > 0) {
      navigation.navigate("LifeListStack", {
        screen: "ViewExperience",
        params: { experienceId: _id },
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleToggleListStatus = async () => {
    if (listStatus === "EXPERIENCED" && associatedShots.length > 0) {
      setIsAlertVisible(true);
    } else {
      const newListStatus =
        listStatus === "EXPERIENCED" ? "WISHLISTED" : "EXPERIENCED";
      setListStatus(newListStatus);
      try {
        await updateListStatus({
          variables: {
            lifeListExperienceId: _id,
            newListStatus,
          },
        });
      } catch (error) {
        console.error("Failed to update list status:", error);
      }
    }
  };

  const confirmChangeListStatus = async () => {
    const newListStatus =
      listStatus === "EXPERIENCED" ? "WISHLISTED" : "EXPERIENCED";
    setListStatus(newListStatus);
    try {
      await updateListStatus({
        variables: {
          lifeListExperienceId: _id,
          newListStatus,
        },
      });
      if (listStatus === "EXPERIENCED") {
        await updateShots({
          variables: {
            lifeListExperienceId: _id,
            shotIds: [],
          },
        });
      }
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
      experienceId: _id,
      associatedShots,
    });
  };

  const handleUpdateShots = async (newShots) => {
    try {
      await updateShots({
        variables: {
          lifeListExperienceId: _id,
          shotIds: newShots.map((shot) => shot._id),
        },
      });
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
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
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{truncatedTitle}</Text>
            <View style={styles.secondaryTextContainer}>
              <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
              {associatedShots && associatedShots.length > 0 && (
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
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Icon
                name="ellipsis"
                tintColor={"#696969"}
                style={iconStyles.ellipsis}
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
              style={iconStyles.trashSm}
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
                    {associatedShots.length === 0
                      ? "Add Shots"
                      : "Manage Shots"}
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
      <CustomAlert
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
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1.5,
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
  },
  photoIcon: {
    marginLeft: 6,
    width: 15,
    height: 12.04,
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 8,
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
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionsText: {
    fontSize: 12,
    fontWeight: "500",
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
