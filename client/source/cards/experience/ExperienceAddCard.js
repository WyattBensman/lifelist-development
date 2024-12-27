import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { truncateText, capitalizeText } from "../../../utils/commonHelpers";
import Icon from "../../../icons/Icon";
import { cardStyles } from "../../../styles";

export default function ExperienceAddCard({
  lifeListExperience,
  onDelete,
  onListSelect,
}) {
  const navigation = useNavigation();
  const { experience, list, associatedShots } = lifeListExperience;
  const [listStatus, setListStatus] = useState(list || "");

  const imageUrl = experience?.image;
  const truncatedTitle = truncateText(experience?.title || "", 30);
  const capitalizedCategory = capitalizeText(experience?.category || "");

  useEffect(() => {
    setListStatus(list || "");
  }, [list]);

  const handleSelectList = (newListStatus) => {
    setListStatus(newListStatus);
    onListSelect(newListStatus);
  };

  const handleManageShots = () => {
    navigation.navigate("ManageTempShots", {
      experienceId: experience._id,
      associatedShots: associatedShots || [],
    });
  };

  if (!experience) {
    return (
      <View style={cardStyles.placeholderContainer}>
        <Text>Loading experience...</Text>
      </View>
    );
  }

  return (
    <View style={cardStyles.experienceListContainer}>
      <View style={cardStyles.contentContainer}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <View style={cardStyles.textContainer}>
          <Text style={cardStyles.primaryText}>{truncatedTitle}</Text>
          <Text style={cardStyles.secondaryText}>{capitalizedCategory}</Text>
        </View>
      </View>

      <View style={cardStyles.optionsContainer}>
        <Icon
          name="trash"
          style={cardStyles.trashIcon}
          tintColor={"#8A8A8E"}
          onPress={() => onDelete(experience._id)}
        />

        <View style={cardStyles.buttonsContainer}>
          {listStatus !== "EXPERIENCED" && listStatus !== "WISHLISTED" && (
            <>
              <Pressable
                style={[cardStyles.optionsButton, cardStyles.spacer]}
                onPress={() => handleSelectList("EXPERIENCED")}
              >
                <Text style={cardStyles.optionsText}>Experienced</Text>
              </Pressable>
              <Pressable
                style={[cardStyles.optionsButton, cardStyles.spacer]}
                onPress={() => handleSelectList("WISHLISTED")}
              >
                <Text style={cardStyles.optionsText}>Wish Listed</Text>
              </Pressable>
            </>
          )}

          {listStatus === "EXPERIENCED" && (
            <>
              <Pressable
                style={[cardStyles.optionsButton, cardStyles.spacer]}
                onPress={handleManageShots}
              >
                <Text style={cardStyles.optionsText}>
                  {associatedShots.length === 0 ? "Add Shots" : "Manage Shots"}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  cardStyles.optionsButton,
                  cardStyles.experiencedButton,
                  cardStyles.spacer,
                ]}
                onPress={() => handleSelectList("WISHLISTED")}
              >
                <Text
                  style={[cardStyles.optionsText, cardStyles.experiencedColor]}
                >
                  Experienced
                </Text>
              </Pressable>
            </>
          )}

          {listStatus === "WISHLISTED" && (
            <Pressable
              style={[cardStyles.optionsButton, cardStyles.wishListedButton]}
              onPress={() => handleSelectList("EXPERIENCED")}
            >
              <Text
                style={[cardStyles.optionsText, cardStyles.wishlistedColor]}
              >
                Wish Listed
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
