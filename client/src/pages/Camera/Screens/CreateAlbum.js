import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { headerStyles, layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import SelectableShotCard from "../Cards/SelectableShotCard";
import Icon from "../../../components/Icons/Icon";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext"; // CameraAlbum context
import { useCameraRoll } from "../../../contexts/CameraRollContext"; // CameraRoll context

export default function CreateAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumTitle } = route.params; // Album title passed from the modal

  const [selectedShots, setSelectedShots] = useState([]); // Shots selected by the user
  const [changesMade, setChangesMade] = useState(false); // Tracks whether any shots are selected

  // Contexts for camera roll and albums
  const { addAlbumToCache } = useCameraAlbums();
  const {
    initializeCameraRollCache,
    shots: cameraRollShots,
    isCameraRollCacheInitialized,
  } = useCameraRoll();

  // Initialize the camera roll cache on mount
  useEffect(() => {
    const initializeCache = async () => {
      if (!isCameraRollCacheInitialized) {
        await initializeCameraRollCache();
      }
    };
    initializeCache();
  }, [initializeCameraRollCache, isCameraRollCacheInitialized]);

  // Check if changes were made (i.e., any shots are selected)
  useEffect(() => {
    setChangesMade(selectedShots.length > 0);
  }, [selectedShots]);

  // Toggle shot selection
  const handleCheckboxToggle = (shot) => {
    const isAlreadySelected = selectedShots.some((s) => s.shotId === shot._id);

    if (isAlreadySelected) {
      setSelectedShots((prev) => prev.filter((s) => s.shotId !== shot._id));
    } else {
      setSelectedShots((prev) => [
        ...prev,
        { shotId: shot._id, image: shot.imageThumbnail },
      ]);
    }
  };

  // Save the new album
  const saveChanges = async () => {
    try {
      if (!selectedShots.length) {
        Alert.alert(
          "Error",
          "Please select at least one shot to create an album."
        );
        return;
      }

      const newAlbumData = {
        title: albumTitle,
        shots: selectedShots.map((shot) => shot.shotId),
        shotsCount: selectedShots.length,
        coverImage: selectedShots[0]?.image, // Use the first selected shot as the cover image
      };

      const newAlbumId = await addAlbumToCache(newAlbumData);

      if (newAlbumId) {
        navigation.navigate("ViewAlbum", { albumId: newAlbumId });
      } else {
        Alert.alert("Error", "Failed to create album. Please try again.");
      }
    } catch (error) {
      console.error("[CreateAlbum] Error creating album:", error);
      Alert.alert("Error", "An error occurred while creating the album.");
    }
  };

  // Render each shot card
  const renderShot = ({ item }) => (
    <SelectableShotCard
      shot={item}
      isSelected={selectedShots.some((s) => s.shotId === item._id)}
      onCheckboxToggle={() => handleCheckboxToggle(item)}
    />
  );

  // If the camera roll is still loading, show a loading indicator
  if (!isCameraRollCacheInitialized) return <Text>Loading Camera Roll...</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={albumTitle}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={saveChanges} disabled={!changesMade}>
            <Text
              style={[
                styles.createButtonText,
                changesMade && styles.createButtonTextActive,
              ]}
            >
              Create
            </Text>
          </Pressable>
        }
      />

      <FlatList
        data={cameraRollShots} // Use shots from CameraRollContext
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <Text
            style={[
              headerStyles.headerMedium,
              { marginLeft: 10, marginTop: 8 },
            ]}
          >
            {`Selected Shots (${selectedShots.length})`}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createButtonText: {
    fontSize: 12,
    color: "#696969",
    fontWeight: "600",
  },
  createButtonTextActive: {
    color: "#6AB952",
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  flatListContent: {
    flexGrow: 1,
  },
});
