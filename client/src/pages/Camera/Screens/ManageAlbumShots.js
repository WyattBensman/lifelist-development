import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import { useCameraRoll } from "../../../contexts/CameraRollContext";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function ManageAlbumShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { albumId, associatedShots = [] } = route.params;

  const { initializeAlbumCache, updateAlbumShotsInCache } = useCameraAlbums();
  const {
    initializeCameraRollCache,
    shots: cameraRollShots,
    loadNextPage,
    isCameraRollCacheInitialized,
  } = useCameraRoll();

  const [selectedShots, setSelectedShots] = useState(associatedShots);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState("Manage Shots");

  // Hide the tab bar when this screen is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  });

  // Initialize album and camera roll caches once
  useEffect(() => {
    const initCaches = async () => {
      if (!isCameraRollCacheInitialized) {
        await initializeCameraRollCache();
      }
      await initializeAlbumCache();
    };
    initCaches();
  }, [
    initializeAlbumCache,
    initializeCameraRollCache,
    isCameraRollCacheInitialized,
  ]);

  // Update title and check for modifications when `associatedShots` changes
  useEffect(() => {
    setTitle(associatedShots.length === 0 ? "Add Shots" : "Manage Shots");
    setIsModified(
      selectedShots.length !== associatedShots.length ||
        selectedShots.some(
          (shot) => !associatedShots.some((s) => s._id === shot._id)
        )
    );
  }, [associatedShots, selectedShots]);

  // Create a prioritized data array for the FlatList
  const prioritizedShots = [
    ...selectedShots, // Selected shots first
    ...cameraRollShots.filter(
      (shot) => !selectedShots.some((s) => s._id === shot._id)
    ), // Remaining shots
  ];

  // Toggle selection for a shot
  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isSelected = prev.some((s) => s._id === shot._id);
      return isSelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
    });
  };

  // Save changes and update the cache
  const handleSave = async () => {
    if (!isModified) return;

    try {
      await updateAlbumShotsInCache(albumId, selectedShots);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update album shots:", error);
      Alert.alert(
        "Save Failed",
        "We were unable to save your changes. Please try again."
      );
    }
  };

  // Fetch additional shots when reaching the end of the list
  const handleEndReached = () => {
    if (isCameraRollCacheInitialized) loadNextPage();
  };

  if (!isCameraRollCacheInitialized) return <Text>Loading Camera Roll...</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={title}
        button1={
          <Pressable onPress={handleSave} disabled={!isModified}>
            <Text
              style={[styles.buttonText, isModified && styles.buttonTextActive]}
            >
              Save
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={prioritizedShots} // Use prioritized data array
        renderItem={({ item }) => (
          <ShotCard
            shot={item}
            isSelected={selectedShots.some((s) => s._id === item._id)}
            onCheckboxToggle={() => handleCheckboxToggle(item)}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 12,
    color: "#696969", // Inactive color
    fontWeight: "600",
  },
  buttonTextActive: {
    color: "#6AB952", // Active color when modified
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 0, // Ensures no margin on the outside
  },
});
