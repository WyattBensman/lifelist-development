import React, { useState } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles, iconStyles, layoutStyles } from "../../../styles";
import {
  truncateText,
  capitalizeText,
  capitalizeTextNoSlice,
} from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import Icon from "../../../icons/Icon";
import IconStatic from "../../../icons/IconStatic";

export default function ListItemCard({ experience, editMode }) {
  const [isSelected, setIsSelected] = useState(false);
  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const truncatedTitle = truncateText(experience.experience.title, 40);
  const truncatedShortTitle = truncateText(experience.experience.title, 20);
  const capitalizedCategory = capitalizeText(experience.experience.category);
  const experiencedText = capitalizeTextNoSlice(experience.list);

  const handlePress = () => {
    if (editMode) {
      setIsSelected(!isSelected);
    }
  };

  const listStyle =
    experience.list === "EXPERIENCED"
      ? styles.experiencedText
      : styles.wishlistedText;

  return (
    <View>
      <Pressable
        onPress={editMode ? handlePress : null}
        style={[styles.listItemContainer, isSelected && styles.selected]}
      >
        <View style={styles.contentContainer}>
          <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {!editMode ? truncatedTitle : truncatedShortTitle}
            </Text>

            {!editMode && (
              <Text style={{ fontSize: 12, color: "#98989F", marginTop: 2 }}>
                {capitalizedCategory}
              </Text>
            )}
          </View>
          <Icon
            name="ellipsis"
            tintColor={"#98989F"}
            style={iconStyles.ellipsis}
          />
          {editMode && (
            <View style={styles.buttonContainer}>
              <View
                style={[
                  styles.listButton,
                  experience.list === "EXPERIENCED" && { borderColor: "#eee" },
                  experience.list === "WISHLISTED" && { borderColor: "#eee" },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    experience.list === "EXPERIENCED" && { color: "#6AB952" },
                    experience.list === "WISHLISTED" && { color: "#5FC4ED" },
                  ]}
                >
                  {experiencedText}
                </Text>
                <View>
                  <IconStatic
                    name="chevron.up"
                    style={iconStyles.chevronDown}
                    spacer={4}
                  />
                  <IconStatic
                    name="chevron.down"
                    style={[iconStyles.chevronDown, { marginTop: 0.75 }]}
                    spacer={4}
                  />
                </View>
              </View>
              <View style={styles.button}>
                <Text style={styles.buttonText}>More</Text>
                <IconStatic
                  name="chevron.down"
                  style={iconStyles.chevronDown}
                  spacer={4}
                />
              </View>
              <View style={styles.iconContainer}>
                <Icon
                  name="trash"
                  style={iconStyles.trash}
                  tintColor="#d4d4d4"
                />
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginTop: 4,
    flex: 1,
    padding: 8,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
  },
  contentContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: 63,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
    borderColor: "#eee",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginRight: 16, // THIIS
    marginLeft: 60, // THIS
  },
  labelSmall: {
    fontSize: 12,
    color: "#d4d4d4",
    fontStyle: "italic",
    marginTop: 4,
  },
  addAction: {
    color: "#5FAF46",
    fontSize: 12,
  },
});

<View>
  <View style={styles.actionsContainer}>
    <View>
      <Text>Associated Shots</Text>
      {/* {associatedShots.length === 0 ? (
              <Text style={styles.labelSmall}>No Associated Shots</Text>
            ) : (
              <FlatList
                horizontal
                data={associatedShots}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: `${BASE_URL}${item.shot.image}` }}
                    style={styles.shotImage}
                  />
                )}
                keyExtractor={(item) => item.shot._id}
              />
            )} */}
    </View>
    <Pressable>
      <Text style={styles.addAction}>
        {/* {associatedShots.length === 0 ? "Add Shots" : "Edit Shots"} */}
        Add Shots
      </Text>
    </Pressable>
  </View>
</View>;
