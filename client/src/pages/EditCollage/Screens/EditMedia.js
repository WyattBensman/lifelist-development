import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icons/Icon";
import MediaPlaceholder from "../../CreateCollage/Components/MediaPlaceholder";
import DraggableFlatList from "react-native-draggable-flatlist";
import ShotCard from "../../CreateCollage/Cards/ShotCard";
import SelectedShotCard from "../../CreateCollage/Cards/SelectedShotCard";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCreateCollageContext } from "../../../contexts/CreateCollageContext";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";

export default function EditMedia() {
  const navigation = useNavigation();
  const { params } = useRoute(); // Access the navigation params
  const { collage, updateCollage, hasModified } = useCreateCollageContext(); // Access collage context methods
  const [showAlert, setShowAlert] = useState(false);

  // Fetch all available images (gallery)
  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);

  // Initialize context with passed data
  useEffect(() => {
    if (params?.collageData) {
      // Map `images` to a consistent structure (if needed)
      const selectedImages = params.collageData.images.map((imagePath) => ({
        image: imagePath, // Use image path
      }));

      updateCollage({
        _id: params.collageId, // populate
        caption: params.collageData.caption, // Prepopulate caption
        images: selectedImages, // Prepopulate selected images
        coverImage: params.collageData.coverImage, // Prepopulate cover image
        taggedUsers: params.collageData.taggedUsers, // Prepopulate tagged users
      });
    }
  }, [params]);

  // Back press logic with unsaved changes warning
  const handleBackPress = () => {
    if (hasModified) {
      setShowAlert(true); // Show alert if changes have been made
    } else {
      navigation.goBack();
    }
  };

  // Confirm alert action
  const handleConfirmAlert = () => {
    setShowAlert(false); // Close alert
    navigation.goBack();
  };

  // Toggle selection of images
  const handleCheckboxToggle = (imagePath) => {
    const isSelected = collage.images.some((shot) => shot.image === imagePath);

    if (isSelected) {
      // Remove image
      updateCollage({
        images: collage.images.filter((shot) => shot.image !== imagePath),
      });
    } else {
      // Add image
      const selectedShot = data?.getAllCameraShots.find(
        (shot) => shot.image === imagePath
      );
      if (selectedShot) {
        updateCollage({
          images: [...collage.images, selectedShot],
        });
      }
    }
  };

  // Handle drag-and-drop for image reordering
  const handleDragEnd = ({ data }) => {
    updateCollage({ images: data });
  };

  // Proceed to the next page (EditOverview)
  const handleNextPage = () => {
    if (collage.images.length > 0) {
      navigation.navigate("EditOverview");
    }
  };

  // Render a gallery item
  const renderShotItem = ({ item }) => {
    const isSelected = collage.images.some((shot) => shot.image === item.image);

    return (
      <ShotCard
        shot={item}
        isSelected={isSelected}
        onCheckboxToggle={() => handleCheckboxToggle(item.image)}
      />
    );
  };

  // Render a selected image item
  const renderSelectedShot = ({ item, drag }) => (
    <SelectedShotCard
      item={item}
      handleImagePress={(imagePath) =>
        updateCollage({
          images: collage.images.filter((shot) => shot.image !== imagePath),
        })
      }
      drag={drag}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header Section */}
      <HeaderStack
        title={"Edit Media"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
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
            renderItem={renderSelectedShot}
            keyExtractor={(item) => item.image}
            horizontal
            onDragEnd={handleDragEnd}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Image Gallery Section */}
      <Text style={styles.instructions}>Your Images</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={data.getAllCameraShots}
          renderItem={renderShotItem}
          keyExtractor={(item) => item.image}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Custom Alert for Unsaved Changes */}
      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
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
