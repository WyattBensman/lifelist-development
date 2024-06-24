import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries"; // Adjust the path as needed
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../Cards/ViewShotCard";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function CameraRoll() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

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
          <Icon
            name="ellipsis"
            style={iconStyles.ellipsis}
            weight="bold"
            onPress={() => console.log("Ellipsis pressed")}
          />
        }
        hasBorder={false}
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
        <Pressable style={styles.iconButton}>
          <Icon name="paperplane" style={iconStyles.shareIcon} weight="bold" />
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
