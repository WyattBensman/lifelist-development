import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../../Camera/Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import DangerAlert from "../../../components/Alerts/DangerAlert";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewExperienceShot() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shotId, associatedShots } = route.params;

  const [shots, setShots] = useState(associatedShots || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentShot, setCurrentShot] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Set initial index based on `shotId`
  useEffect(() => {
    const initialIndex = shots.findIndex((shot) => shot._id === shotId);
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [shotId, shots]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
        setCurrentShot(shots[newIndex]);
      }
    },
    [shots]
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
    if (!currentShot?.imageThumbnail) return;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(currentShot.imageThumbnail);
    } else {
      alert("Sharing is not available on this device.");
    }
  };

  const handleDeletePress = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    // Deletion logic for the current shot
    const updatedShots = shots.filter((shot) => shot._id !== currentShot._id);
    setShots(updatedShots);
    setCurrentIndex(Math.max(currentIndex - 1, 0));
    setIsDeleteAlertVisible(false);
  };

  if (shots.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const dropdownItems = [
    {
      icon: "trash",
      style: iconStyles.deleteIcon,
      label: "Remove Shot",
      onPress: handleDeletePress,
      backgroundColor: "#FF634730",
      tintColor: "#FF6347",
    },
  ];

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
      />
      <View style={{ height: imageHeight }}>
        <FlatList
          data={shots}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <ViewShotCard imageUrl={item.imageThumbnail} shotId={item._id} />
            </View>
          )}
          keyExtractor={(item) => item._id}
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
      <Pressable style={styles.iconButton} onPress={handleSharePress}>
        <Icon name="paperplane" style={iconStyles.shareIcon} weight="bold" />
      </Pressable>
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
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
