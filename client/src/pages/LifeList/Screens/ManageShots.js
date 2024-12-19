import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useCameraRoll } from "../../../contexts/CameraRollContext"; // CameraRoll Context
import { useLifeList } from "../../../contexts/LifeListContext"; // LifeList Context

export default function ManageShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const {
    shots,
    loadNextPage,
    initializeCameraRollCache,
    isCameraRollCacheInitialized,
  } = useCameraRoll();
  const { updateLifeListExperienceInCache } = useLifeList();

  const { experienceId, associatedShots } = route.params;

  const [selectedShots, setSelectedShots] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState("Manage Shots");

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    if (!isCameraRollCacheInitialized) {
      initializeCameraRollCache();
    }
  }, [isCameraRollCacheInitialized, initializeCameraRollCache]);

  useEffect(() => {
    if (associatedShots) {
      setSelectedShots([...associatedShots]);
      setTitle(associatedShots.length === 0 ? "Add Shots" : "Manage Shots");
    }
  }, [associatedShots]);

  useEffect(() => {
    setIsModified(
      selectedShots.length !== associatedShots.length ||
        selectedShots.some(
          (shot) =>
            !associatedShots.some((initialShot) => initialShot._id === shot._id)
        )
    );
  }, [selectedShots, associatedShots]);

  // Create prioritized data for the FlatList
  const prioritizedShots = [
    ...selectedShots, // Pre-selected shots appear first
    ...shots.filter((shot) => selectedShots.every((s) => s._id !== shot._id)), // Remaining shots
  ];

  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isAlreadySelected = prev.some((s) => s._id === shot._id);
      return isAlreadySelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
    });
  };

  const handleSave = async () => {
    if (!isModified) return;

    try {
      await updateLifeListExperienceInCache({
        lifeListExperienceId: experienceId,
        associatedShots: selectedShots,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
  };

  const handleEndReached = () => {
    loadNextPage();
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
        data={prioritizedShots}
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
    marginHorizontal: 0,
  },
});
