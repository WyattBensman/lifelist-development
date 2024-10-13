import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import MediaPlaceholder from "../Components/MediaPlaceholder";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import DraggableFlatList from "react-native-draggable-flatlist";
import ShotCard from "../Cards/ShotCard";
import SelectedShotCard from "../Cards/SelectedShotCard";

export default function Media() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [selectedShots, setSelectedShots] = useState([]); // Store selected images
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  // Toggle the checkbox for the image selection
  const handleCheckboxToggle = (id) => {
    const isSelected = selectedShots.some((shot) => shot._id === id);
    if (isSelected) {
      // Remove if already selected
      setSelectedShots(selectedShots.filter((shot) => shot._id !== id));
    } else {
      // Add to selected images if not already selected
      const selectedShot = data.getAllCameraShots.find(
        (shot) => shot._id === id
      );
      setSelectedShots([...selectedShots, selectedShot]);
    }
  };

  // Handle removing an image from the selected images
  const handleRemoveImage = (id) => {
    setSelectedShots(selectedShots.filter((shot) => shot._id !== id));
  };

  // Handle reordering of selected images
  const handleDragEnd = ({ data }) => {
    setSelectedShots(data); // Update state with new order
  };

  // Render a single shot item in the gallery
  const renderShotItem = ({ item }) => (
    <ShotCard
      shot={item}
      isSelected={selectedShots.some((shot) => shot._id === item._id)}
      onCheckboxToggle={handleCheckboxToggle}
    />
  );

  // Render a single item in the selected images list
  const renderSelectedShot = ({ item, drag }) => (
    <SelectedShotCard
      item={item}
      handleImagePress={handleRemoveImage}
      drag={drag}
    />
  );

  // Navigate to next screen with selected images
  const handleNextPage = () => {
    if (selectedShots.length > 0) {
      navigation.navigate("CollageOverview", { selectedImages: selectedShots });
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header Section */}
      <HeaderStack
        title={"Media"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            onPress={handleNextPage}
            disabled={selectedShots.length === 0}
            style={iconStyles.backArrow}
            weight={selectedShots.length > 0 ? "heavy" : "semibold"}
            tintColor={selectedShots.length > 0 ? "#6AB952" : "#696969"}
          />
        }
      />

      {/* Selected Images Section */}
      <View style={styles.selectedContainer}>
        {selectedShots.length === 0 ? (
          <MediaPlaceholder />
        ) : (
          <DraggableFlatList
            data={selectedShots}
            renderItem={renderSelectedShot} // Render each selected image in the draggable list
            keyExtractor={(item) => item._id.toString()}
            horizontal // Display selected images in a horizontal list
            onDragEnd={handleDragEnd} // Update state on drag end
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Image Gallery Section */}
      <Text style={styles.instructions}>Camera Shots</Text>
      <FlatList
        data={data.getAllCameraShots}
        renderItem={renderShotItem} // Render each gallery image
        keyExtractor={(item) => item._id.toString()}
        numColumns={3} // Display images in a 3-column grid
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectedContainer: {
    height: 220,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1C1C1C",
  },
  instructions: {
    margin: 8,
    marginTop: 16,
    color: "#fff",
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

/*   const handleCheckboxToggle = (shot) => {
    setSelectedShots((prevSelectedShots) => {
      if (prevSelectedShots.find((s) => s._id === shot._id)) {
        return prevSelectedShots.filter((s) => s._id !== shot._id);
      } else {
        return [...prevSelectedShots, shot];
      }
    });
  };

  const handleImagePress = (shot) => {
    setSelectedShots((prevSelectedShots) =>
      prevSelectedShots.filter((s) => s._id !== shot._id)
    );
  };

  const renderShotItem = ({ item }) => (
    <ShotCard
      shot={item}
      isSelected={selectedShots.some((s) => s._id === item._id)}
      onCheckboxToggle={() => handleCheckboxToggle(item)}
      navigation={navigation}
    />
  );

  const renderSelectedShotItem = ({ item, drag, isActive }) => (
    <Pressable
      onPress={() => handleImagePress(item)}
      onLongPress={drag}
      style={{
        backgroundColor: isActive ? "#e2e2e2" : "#f9f9f9",
        marginRight: 8,
      }}
    >
      <SelectedShotCard item={item} />
    </Pressable>
  ); */
