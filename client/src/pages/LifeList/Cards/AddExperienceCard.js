import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { cardStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";

export default function AddExperienceCard({
  experience,
  onListSelect,
  onUpdateShots,
  onUpdateCollages,
}) {
  const [listStatus, setListStatus] = useState(experience.list);

  const imageUrl = `${BASE_URL}${experience.experience.image}`;
  const { title, category } = experience.experience;
  const associatedShots = experience.associatedShots;
  const associatedCollages = experience.associatedCollages;

  const handleSelectList = (list) => {
    setListStatus(list);
    onListSelect(experience.experience._id, list); // Update parent component's state
  };

  const handleManageShots = () => {
    onUpdateShots(experience.experience._id, associatedShots);
  };

  const handleManageCollages = () => {
    onUpdateCollages(experience.experience._id, associatedCollages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageLg} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.category}>{category}</Text>
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
                  source={{ uri: `${baseURL}${item.image}` }}
                  style={styles.shotImage}
                />
              )}
              keyExtractor={(item) => item._id}
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
    position: "relative",
  },
  topRow: {
    flexDirection: "row",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
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
    width: 40,
    height: 40,
    marginRight: 8,
  },
});
