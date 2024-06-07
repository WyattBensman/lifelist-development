import React, { useState } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles, iconStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import IconStatic from "../../../icons/IconStatic";

export default function AddExperienceCard({
  experience,
  onDelete,
  onListSelect,
  onUpdateShots,
}) {
  const [listStatus, setListStatus] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 30);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const associatedShots = experience.associatedShots;

  const handleSelectList = (list) => {
    setListStatus(list);
    onListSelect(experience.experience._id, list);
    setDropdownVisible(false);
  };

  const handleManageShots = () => {
    onUpdateShots(experience.experience._id, associatedShots);
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        <IconStatic
          name="trash"
          style={iconStyles.trashSm}
          tintColor={"#8A8A8E"}
          onPress={() => onDelete(experience.experience._id)}
        />
        <View style={styles.buttonsContainer}>
          {listStatus !== "WISHLISTED" && (
            <Pressable
              style={[styles.optionsButton, styles.spacer]}
              onPress={handleManageShots}
            >
              <Text style={styles.optionsText}>
                {associatedShots.length === 0 ? "Add Shots" : "Edit Shots"}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.optionsButton,
              styles.spacer,
              listStatus === "EXPERIENCED" && styles.experiencedButton,
              listStatus === "WISHLISTED" && styles.wishListedButton,
            ]}
            onPress={() => setDropdownVisible(!isDropdownVisible)}
          >
            <Text
              style={[
                styles.optionsText,
                listStatus === "EXPERIENCED" && styles.experiencedColor,
                listStatus === "WISHLISTED" && styles.wishlistedColor,
              ]}
            >
              {listStatus === "EXPERIENCED"
                ? "Experienced"
                : listStatus === "WISHLISTED"
                ? "Wish Listed"
                : "Select List"}
            </Text>
          </Pressable>
          {isDropdownVisible && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownOption}
                onPress={() => handleSelectList("EXPERIENCED")}
              >
                <Text style={styles.dropdownOptionText}>Experienced</Text>
              </Pressable>
              <Pressable
                style={styles.dropdownOption}
                onPress={() => handleSelectList("WISHLISTED")}
              >
                <Text style={styles.dropdownOptionText}>Wish Listed</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
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
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
  },
  secondaryText: {
    fontSize: 12,
    color: "#8A8A8E",
    marginTop: 1.5,
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
    flexDirection: "row",
    backgroundColor: "#ececec",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  spacer: {
    marginLeft: 8,
  },
  dropdown: {
    position: "absolute",
    top: 32,
    left: 0,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 1,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownOptionText: {
    color: "#000",
  },
  experiencedButton: {
    backgroundColor: "#6AB95230",
  },
  wishListedButton: {
    backgroundColor: "#5FC4ED30",
  },
  experiencedColor: {
    color: "#6AB952",
  },
  wishlistedColor: {
    color: "#5FC4ED",
  },
});
