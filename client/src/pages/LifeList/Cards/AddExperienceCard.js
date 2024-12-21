import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { truncateText, capitalizeText } from "../../../utils/utils";
import IconStatic from "../../../components/Icons/IconStatic";
import { StyleSheet } from "react-native";
import { cardStyles, iconStyles } from "../../../styles";

export default function AddExperienceCard({
  lifeListExperience, // Expect full lifeListExperience object with experience data
  onDelete, // Function to handle deletion
  onListSelect, // Function to handle list status change (experienced/wishlisted)
}) {
  const navigation = useNavigation(); // Use navigation hook to navigate to other screens
  const { experience, list, associatedShots } = lifeListExperience; // Destructure from the lifeListExperience object
  const [listStatus, setListStatus] = useState(list || "");

  // Ensure the image URL is constructed properly with BASE_URL
  const imageUrl = experience?.image;
  const truncatedTitle = truncateText(experience?.title || "", 30);
  const capitalizedCategory = capitalizeText(experience?.category || "");

  // Sync local listStatus with the experience data
  useEffect(() => {
    setListStatus(list || "");
  }, [list]);

  // Handle selecting between EXPERIENCED and WISHLISTED
  const handleSelectList = (newListStatus) => {
    setListStatus(newListStatus);
    onListSelect(newListStatus); // Pass only the list status change
  };

  // Navigate to ManageTempShots screen with experienceId and associatedShots
  const handleManageShots = () => {
    navigation.navigate("ManageTempShots", {
      experienceId: experience._id, // Pass the experience ID
      associatedShots: associatedShots || [], // Pass the associated shots
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
    <View style={[cardStyles.cardContainer, styles.listItemContainer]}>
      <View style={styles.contentContainer}>
        {/* Ensure image is displayed properly */}
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <Text style={styles.secondaryText}>{capitalizedCategory}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {/* Trash Icon for Deleting Experience */}
        <IconStatic
          name="trash"
          style={iconStyles.trashSm}
          tintColor={"#8A8A8E"}
          onPress={() => onDelete(experience._id)} // Call delete handler with experience._id
        />

        {/* List Status Buttons */}
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
                onPress={handleManageShots} // Navigate to ManageTempShots
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
