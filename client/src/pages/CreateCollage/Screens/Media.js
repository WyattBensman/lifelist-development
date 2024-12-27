import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import MediaPlaceholder from "../Components/MediaPlaceholder";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import DraggableFlatList from "react-native-draggable-flatlist";
import ShotCard from "../Cards/ShotCard";
import SelectedShotCard from "../Cards/SelectedShotCard";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCreateCollageContext } from "../../../contexts/CreateCollageContext";
import { useCameraRoll } from "../../../contexts/CameraRollContext";

export default function Media() {
  const navigation = useNavigation();
  const { collage, updateCollage, resetCollage, hasModified } =
    useCreateCollageContext();
  const { setIsTabBarVisible } = useNavigationContext();
  const [showAlert, setShowAlert] = useState(false);

  // Camera Roll Context
  const {
    shots,
    initializeCameraRollCache,
    loadNextPage,
    isCameraRollCacheInitialized,
  } = useCameraRoll();

  useFocusEffect(() => {
    setIsTabBarVisible(false);

    // Initialize camera roll cache
    if (!isCameraRollCacheInitialized) {
      initializeCameraRollCache();
    }
  });

  // Show the alert on back press if more than 3 images or hasModified is true
  const handleBackPress = () => {
    if (collage.images.length > 3 || hasModified) {
      setShowAlert(true); // Show alert if conditions are met
    } else {
      navigation.goBack(); // Directly go back if no alert is needed
    }
  };

  // Handle confirm in the alert
  const handleConfirmAlert = () => {
    resetCollage();
    setShowAlert(false); // Close alert
    navigation.goBack(); // Proceed with the back action
  };

  // Toggle the checkbox for the image selection
  const handleCheckboxToggle = (id) => {
    const isSelected = collage.images.some((shot) => shot._id === id);
    if (isSelected) {
      // Remove the image if it is already selected
      updateCollage(
        {
          images: collage.images.filter((shot) => shot._id !== id),
        },
        true // Mark this as an image update, not modifying the collage
      );
    } else {
      // Add the image to the collage if not already selected
      const selectedShot = shots.find((shot) => shot._id === id);
      updateCollage(
        {
          images: [...collage.images, selectedShot],
        },
        true // Mark this as an image update, not modifying the collage
      );
    }
  };

  // Handle reordering of selected images
  const handleDragEnd = ({ data }) => {
    updateCollage({ images: data }, true); // Update collage with new order, mark as image update
  };

  // Render a single shot item in the gallery
  const renderShotItem = ({ item }) => (
    <ShotCard
      shot={item}
      isSelected={collage.images.some((shot) => shot._id === item._id)}
      onCheckboxToggle={handleCheckboxToggle}
    />
  );

  // Render a single item in the selected images list
  const renderSelectedShot = ({ item, drag }) => (
    <SelectedShotCard
      item={item}
      handleImagePress={(id) =>
        updateCollage(
          {
            images: collage.images.filter((shot) => shot._id !== id),
          },
          true // Mark this as an image update
        )
      }
      drag={drag}
    />
  );

  // Navigate to the next screen with selected images
  const handleNextPage = () => {
    if (collage.images.length > 0) {
      navigation.navigate("CollageOverview");
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
            onPress={handleBackPress} // Use handleBackPress to show the alert on back press
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            onPress={handleNextPage}
            disabled={collage.images.length === 0}
            style={iconStyles.backArrow}
            weight={collage.images.length > 0 ? "heavy" : "semibold"}
            tintColor={collage.images.length > 0 ? "#6AB952" : "#696969"}
          />
        }
      />

      {/* Selected Images Section */}
      <View style={styles.selectedContainer}>
        {collage.images.length === 0 ? (
          <MediaPlaceholder />
        ) : (
          <DraggableFlatList
            data={collage.images}
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
        data={shots}
        renderItem={renderShotItem} // Render each gallery image
        keyExtractor={(item) => item._id.toString()}
        numColumns={3} // Display images in a 3-column grid
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        onEndReached={loadNextPage} // Load more images when reaching the end
        onEndReachedThreshold={0.5} // Trigger load when 50% from the bottom
      />

      {/* Custom Alert for Back Press */}
      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have made changes. Are you sure you want to go back?"
        onConfirm={handleConfirmAlert}
        onCancel={() => setShowAlert(false)}
        confirmButtonText="Leave"
        cancelButtonText="Stay"
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
