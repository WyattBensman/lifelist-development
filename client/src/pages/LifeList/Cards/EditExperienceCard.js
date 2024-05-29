import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useMutation } from "@apollo/client";
import { cardStyles } from "../../../styles";
import {
  UPDATE_LIFELIST_EXPERIENCE_LIST_STATUS,
  UPDATE_ASSOCIATED_SHOTS,
  UPDATE_ASSOCIATED_COLLAGES,
} from "../../../utils/mutations";
import { truncateText } from "../../../utils/utils";

const baseURL = "http://localhost:3001";

export default function EditExperienceCard({ experience, navigation }) {
  const [listStatus, setListStatus] = useState(experience.list);
  const { _id, associatedShots, associatedCollages } = experience;
  const imageUrl = `${baseURL}${experience.experience.image}`;
  const { title } = experience.experience;
  const truncatedTitle = truncateText(title, 24);

  const [updateListStatus] = useMutation(
    UPDATE_LIFELIST_EXPERIENCE_LIST_STATUS
  );
  const [updateShots] = useMutation(UPDATE_ASSOCIATED_SHOTS);
  const [updateCollages] = useMutation(UPDATE_ASSOCIATED_COLLAGES);

  const handleSelectList = async (list) => {
    setListStatus(list);
    try {
      await updateListStatus({
        variables: {
          lifeListExperienceId: _id,
          newListStatus: list,
        },
      });
    } catch (error) {
      console.error("Failed to update list status:", error);
    }
  };

  const handleManageShots = () => {
    navigation.navigate("UpdateShots", {
      experienceId: _id,
      associatedShots,
    });
  };

  const handleManageCollages = () => {
    navigation.navigate("UpdateCollages", {
      experienceId: _id,
      associatedCollages,
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

  const handleUpdateCollages = async (newCollages) => {
    try {
      await updateCollages({
        variables: {
          lifeListExperienceId: _id,
          collageIds: newCollages.map((collage) => collage._id),
        },
      });
    } catch (error) {
      console.error("Failed to update associated collages:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageLg} />
        <View>
          <Text style={styles.title}>{truncatedTitle}</Text>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[
                styles.button,
                listStatus === "EXPERIENCED" && styles.experiencedButton,
              ]}
              onPress={() => handleSelectList("EXPERIENCED")}
            >
              <Text
                style={[
                  styles.buttonText,
                  listStatus === "EXPERIENCED" && styles.selectedText,
                ]}
              >
                Experienced
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                listStatus === "WISHLISTED" && styles.wishListedButton,
              ]}
              onPress={() => handleSelectList("WISHLISTED")}
            >
              <Text
                style={[
                  styles.buttonText,
                  listStatus === "WISHLISTED" && styles.selectedText,
                ]}
              >
                Wish Listed
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <View>
          <Text style={styles.label}>Associated Shots</Text>
          {associatedShots.length === 0 ? (
            <Text style={styles.labelSmall}>No Associated Shots</Text>
          ) : (
            <FlatList
              horizontal
              data={associatedShots}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: `${baseURL}${item.shot.image}` }}
                  style={styles.shotImage}
                />
              )}
              keyExtractor={(item) => item.shot._id}
            />
          )}
        </View>
        <Pressable onPress={handleManageShots}>
          <Text style={styles.addAction}>
            {associatedShots.length === 0 ? "Add Shots" : "Edit Shots"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.actionsContainer}>
        <View>
          <Text style={styles.label}>Associated Collages</Text>
          {associatedCollages.length === 0 ? (
            <Text style={styles.labelSmall}>No Associated Collages</Text>
          ) : (
            <FlatList
              horizontal
              data={associatedCollages}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: `${baseURL}${item.coverImage}` }}
                  style={styles.shotImage}
                />
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
        <Pressable onPress={handleManageCollages}>
          <Text style={styles.addAction}>
            {associatedCollages.length === 0 ? "Add Collages" : "Edit Collages"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginBottom: 24,
    padding: 16,
    position: "relative",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
  },
  topRow: {
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    color: "#d4d4d4",
    marginVertical: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingTop: 4,
    marginTop: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 12,
  },
  experiencedButton: {
    backgroundColor: "#6AB952",
    borderColor: "#6AB952",
  },
  wishListedButton: {
    backgroundColor: "#5FC4ED",
    borderColor: "#5FC4ED",
  },
  selectedText: {
    color: "#fff",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
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
    fontStyle: "italic",
  },
  shotImage: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
});
