import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { UPDATE_ALBUM_SHOTS } from "../../../utils/mutations";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function ManageAlbumShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { albumId, associatedShots } = route.params;

  const { updateAlbumInCache } = useCameraAlbums();

  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [updateShots] = useMutation(UPDATE_ALBUM_SHOTS);

  const [selectedShots, setSelectedShots] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState("Manage Shots");

  // Hide the tab bar when this screen is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  });

  // Set the initial state of selected shots
  useEffect(() => {
    if (associatedShots) {
      setSelectedShots(associatedShots);
      setTitle(associatedShots.length === 0 ? "Add Shots" : "Manage Shots");
    }
  }, [associatedShots]);

  // Check if changes have been made to the selected shots
  useEffect(() => {
    setIsModified(
      selectedShots.length !== associatedShots.length ||
        selectedShots.some(
          (shot) =>
            !associatedShots.some((initialShot) => initialShot._id === shot._id)
        )
    );
  }, [selectedShots, associatedShots]);

  // Toggle a shot's selection
  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isAlreadySelected = prev.some((s) => s._id === shot._id);
      const newShots = isAlreadySelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
      return newShots;
    });
  };

  // Save changes and update cache
  const handleSave = async () => {
    if (!isModified) return;

    try {
      const { data } = await updateShots({
        variables: {
          albumId,
          shotIds: selectedShots.map((shot) => shot._id),
        },
      });

      // Update the album in the cache with the new shots and shotsCount
      updateAlbumInCache(albumId, {
        shots: selectedShots,
        shotsCount: selectedShots.length, // Update shotsCount
      });

      navigation.goBack();
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
  };

  // Refetch all available shots when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
        data={data.getAllCameraShots}
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
