import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import { BASE_URL } from "../../../utils/config";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import { DELETE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewShot() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shotId } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [deleteCameraShot] = useMutation(DELETE_CAMERA_SHOT);

  useEffect(() => {
    if (data) {
      const initialIndex = data.getAllCameraShots.findIndex(
        (shot) => shot._id === shotId
      );
      setCurrentIndex(initialIndex);
    }
  }, [data, shotId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const shotsData = data.getAllCameraShots;
  const currentShot = shotsData[currentIndex];
  const date = new Date(currentShot.capturedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = new Date(currentShot.capturedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

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

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const handleSharePress = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(`${BASE_URL}${currentShot.image}`);
    } else {
      alert("Sharing is not available on this device");
    }
  };

  console.log(currentShot._id);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleDeletePress = async () => {
    try {
      const { data } = await deleteCameraShot({
        variables: { shotId: currentShot._id },
      });
      if (data.deleteCameraShot.success) {
        console.log("Success");
        const newShotsData = shotsData.filter(
          (shot) => shot._id !== currentShot._id
        );
        if (newShotsData.length > 0) {
          console.log("Double Success");
          setCurrentIndex((prevIndex) =>
            prevIndex === newShotsData.length ? prevIndex - 1 : prevIndex
          );
        } else {
          navigation.goBack(); // If no shots are left, go back
        }
        refetch(); // Refetch to get the updated list of shots
      } else {
        alert(data.deleteCameraShot.message);
      }
    } catch (error) {
      console.error("Error deleting shot:", error);
      alert("Failed to delete shot. Please try again.");
    }
  };

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
      onPress: () => console.log("Add to Album"),
      backgroundColor: "#5FC4ED30",
      tintColor: "#5FC4ED",
    },
    {
      icon: "plus",
      style: iconStyles.addExperienceIcon,
      label: "Add to Exp",
      onPress: () => console.log("Add to Experience"),
      backgroundColor: "#6AB95230",
      tintColor: "#6AB952",
    },
  ];

  const dropdownContent = (
    <DropdownMenu
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
            weight={"semibold"}
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
          data={shotsData}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <ViewShotCard imageUrl={item.image} />
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          pagingEnabled
          onViewableItemsChanged={handleViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Pressable style={styles.iconButton} onPress={handleSharePress}>
          <Icon
            name="paperplane"
            style={iconStyles.shareIcon}
            weight="bold"
            onPress={handleSharePress}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    width: "100%",
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
