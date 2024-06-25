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
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import { BASE_URL } from "../../../utils/config";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewShot() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const dropdownItems = [
    {
      icon: "plus",
      style: iconStyles.addExperience,
      label: "Add Experiences",
      onPress: () => console.log("Add Experiences"),
      backgroundColor: "#6AB95230",
      tintColor: "#6AB952",
    },
    {
      icon: "pencil",
      label: "Edit Experiences",
      style: iconStyles.editExperience,
      onPress: () => console.log("Edit Experiences"),
      backgroundColor: "#5FC4ED30",
      tintColor: "#5FC4ED",
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
