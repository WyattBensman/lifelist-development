import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../../Camera/Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import IconButtonWithLabel from "../../../components/Icons/IconButtonWithLabel";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewExperienceShot() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shot, associatedShots } = route.params;

  const [shots, setShots] = useState(associatedShots || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentShot, setCurrentShot] = useState(null);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  });

  // Set initial index based on `shotId`
  useEffect(() => {
    const initialIndex = shots.findIndex((s) => s._id === shot._id);
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [shot, shots]);

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
          <Icon
            name="trash"
            style={styles.trashIcon}
            weight="bold"
            onPress={handleDeletePress}
            noFill={true}
            tintColor={"red"}
          />
        }
        hasBorder={false}
      />
      <View style={{ height: imageHeight }}>
        <FlatList
          data={shots}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <ViewShotCard
                shotId={item._id}
                imageUrl={item.image}
                isVisible={index === currentIndex}
              />
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

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <IconButtonWithLabel
          iconName="paperplane"
          label="Share"
          onPress={handleSharePress}
        />
        <IconButtonWithLabel
          iconName="rectangle.portrait.on.rectangle.portrait.angled"
          label="Post Moment"
          onPress={handleDeletePress}
        />
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
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  trashIcon: {
    height: 18.28,
    width: 15,
  },
});
