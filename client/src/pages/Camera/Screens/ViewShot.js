import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Text,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCameraRoll } from "../../../contexts/CameraRollContext";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import DropdownMenuShot from "../../../components/Dropdowns/DropdownMenuShot";
import DangerAlert from "../../../components/Alerts/DangerAlert";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewShot() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shotId, fromAlbum } = route.params;

  const {
    shots,
    fetchFullResolutionImage,
    preloadFullResolutionImages,
    removeShotFromRoll,
  } = useCameraRoll();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentShot, setCurrentShot] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [isOptionsAlertVisible, setIsOptionsAlertVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Set the initial index based on shotId
  useEffect(() => {
    const initialIndex = shots.findIndex((shot) => shot._id === shotId);
    setCurrentIndex(initialIndex);
  }, [shotId, shots]);

  const handleViewableItemsChanged = useCallback(
    async ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);

        // Preload adjacent images
        await preloadFullResolutionImages(newIndex);

        // Fetch the current shot's full-resolution image
        const shot = shots[newIndex];
        if (shot) {
          const fullResolutionImage = await fetchFullResolutionImage(shot._id);
          setCurrentShot({ ...shot, image: fullResolutionImage });
        }
      }
    },
    [shots, fetchFullResolutionImage, preloadFullResolutionImages]
  );

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isMenuVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSharePress = async () => {
    if (!currentShot?.image) return;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(currentShot.image);
    } else {
      alert("Sharing is not available on this device.");
    }
  };

  const handleDeletePress = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const shotId = currentShot?._id;
      if (shotId) {
        await removeShotFromRoll(shotId);
        const nextIndex =
          currentIndex === shots.length - 1 ? currentIndex - 1 : currentIndex;
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      console.error("Error deleting shot:", error);
      alert("Failed to delete shot.");
    } finally {
      setIsDeleteAlertVisible(false);
    }
  };

  if (shots.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const date = currentShot
    ? new Date(currentShot.capturedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const time = currentShot
    ? new Date(currentShot.capturedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "";

  const dropdownItems = [
    {
      icon: "trash",
      style: iconStyles.deleteIcon,
      label: "Delete Shot",
      onPress: handleDeletePress,
      backgroundColor: "#FF634730",
      tintColor: "#FF6347",
    },
    {
      icon: "folder.badge.plus",
      style: iconStyles.addToAlbum,
      label: "Add to Album",
      onPress: () =>
        navigation.navigate("AddShotToAlbum", { shotId: currentShot?._id }),
      backgroundColor: "#5FC4ED30",
      tintColor: "#5FC4ED",
    },
    {
      icon: "plus",
      style: iconStyles.addExperienceIcon,
      label: "Add to Exp",
      onPress: () =>
        navigation.navigate("AddShotToExperience", {
          shotId: currentShot?._id,
        }),
      backgroundColor: "#6AB95230",
      tintColor: "#6AB952",
    },
  ];

  const dropdownContent = (
    <DropdownMenuShot
      items={dropdownItems}
      containerStyle={{ alignItems: "flex-start" }}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <ViewShotHeader
        arrow={
          <Icon
            name="xmark"
            style={iconStyles.exit}
            onPress={() => navigation.goBack()}
            weight="semibold"
          />
        }
        date={date}
        time={time}
        ellipsis={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={toggleMenu}
            />
          </Animated.View>
        }
        hasBorder={false}
        dropdownVisible={isMenuVisible}
        dropdownContent={dropdownContent}
      />

      <View style={{ height: imageHeight }}>
        <FlatList
          data={shots}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <ViewShotCard
                imageUrl={item.image}
                shotId={item._id}
                fullResolution={currentShot?.image || item.imageThumbnail}
                isVisible={index === currentIndex}
              />
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          pagingEnabled
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          onViewableItemsChanged={handleViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.iconButton, isMenuVisible && styles.disabledButton]}
          onPress={handleSharePress}
        >
          <Icon name="paperplane" style={iconStyles.shareIcon} weight="bold" />
        </Pressable>
      </View>

      <DangerAlert
        visible={isDeleteAlertVisible}
        onRequestClose={() => setIsDeleteAlertVisible(false)}
        title="Delete Camera Shot"
        message="Are you sure you want to delete this shot?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteAlertVisible(false)}
        cancelButtonText="Discard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
  },
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
