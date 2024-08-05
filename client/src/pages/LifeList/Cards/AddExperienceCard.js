import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles, iconStyles } from "../../../styles";
import { truncateText, capitalizeText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import IconStatic from "../../../components/Icons/IconStatic";
import CustomAlert from "../../../components/Alerts/CustomAlert";

export default function AddExperienceCard({
  experience,
  onDelete,
  onListSelect,
  onUpdateShots,
}) {
  const [listStatus, setListStatus] = useState(experience.list || "");
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 30);
  const capitalizedCategory = capitalizeText(experience.experience.subCategory);
  const associatedShots = experience.associatedShots;

  useEffect(() => {
    setListStatus(experience.list || "");
  }, [experience]);

  const handleSelectList = (list) => {
    if (list === "WISHLISTED" && associatedShots.length > 0) {
      setIsAlertVisible(true);
    } else {
      setListStatus(list);
      onListSelect(experience.experience._id, list);
    }
  };

  const confirmChangeListStatus = () => {
    setListStatus("WISHLISTED");
    onListSelect(experience.experience._id, "WISHLISTED");
    onUpdateShots(experience.experience._id, []);
    setIsAlertVisible(false);
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
          {listStatus !== "EXPERIENCED" && listStatus !== "WISHLISTED" && (
            <>
              <Pressable
                style={[styles.optionsButton, styles.spacer]}
                onPress={() => handleSelectList("EXPERIENCED")}
              >
                <Text style={styles.optionsText}>Experienced</Text>
              </Pressable>
              <Pressable
                style={[styles.optionsButton, styles.spacer]}
                onPress={() => handleSelectList("WISHLISTED")}
              >
                <Text style={styles.optionsText}>Wish Listed</Text>
              </Pressable>
            </>
          )}
          {listStatus === "EXPERIENCED" && (
            <>
              <Pressable
                style={[styles.optionsButton, styles.spacer]}
                onPress={handleManageShots}
              >
                <Text style={styles.optionsText}>
                  {associatedShots.length === 0 ? "Add Shots" : "Manage Shots"}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.optionsButton,
                  styles.experiencedButton,
                  styles.spacer,
                ]}
                onPress={() => handleSelectList("WISHLISTED")}
              >
                <Text style={[styles.optionsText, styles.experiencedColor]}>
                  Experienced
                </Text>
              </Pressable>
            </>
          )}
          {listStatus === "WISHLISTED" && (
            <Pressable
              style={[styles.optionsButton, styles.wishListedButton]}
              onPress={() => handleSelectList("EXPERIENCED")}
            >
              <Text style={[styles.optionsText, styles.wishlistedColor]}>
                Wish Listed
              </Text>
            </Pressable>
          )}
        </View>
      </View>
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
  secondaryText: {
    fontSize: 12,
    color: "#696969",
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
  experiencedColor: {
    color: "#6AB952",
  },
  wishlistedColor: {
    color: "#5FC4ED",
  },
});
