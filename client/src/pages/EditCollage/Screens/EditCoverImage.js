import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import Checkbox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useCreateCollageContext } from "../../../contexts/CreateCollageContext";

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const shotWidth = (screenWidth - spacing * 2) / 3;
const shotHeight = (shotWidth * 3) / 2;

export default function EditCoverImage() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { collage, updateCollage } = useCreateCollageContext(); // Access collage context
  const [selectedCoverImage, setSelectedCoverImage] = useState(
    collage.coverImage || collage.images[0]?.image
  );
  const [isModified, setIsModified] = useState(false);

  // Hide the tab bar when the page is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  // Handle selecting a new cover image
  const handleSelectCoverImage = (image) => {
    setSelectedCoverImage(image);
    setIsModified(image !== collage.coverImage); // Mark as modified only if it changes
  };

  // Save the selected cover image and update the context
  const handleSaveCoverImage = () => {
    if (selectedCoverImage) {
      updateCollage({ coverImage: selectedCoverImage }); // Update the context
    }
    navigation.goBack(); // Navigate back
  };

  // Render each image as an option for the cover image
  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleSelectCoverImage(item.image)}>
      <View style={styles.shotContainer}>
        <Image
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.shotImage}
        />
        <Checkbox
          style={styles.checkbox}
          value={selectedCoverImage === item.image}
          onValueChange={() => handleSelectCoverImage(item.image)}
          color={selectedCoverImage === item.image ? "#6AB952" : undefined}
        />
      </View>
    </Pressable>
  );

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header Section */}
      <HeaderStack
        title={"Change Cover Image"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={handleSaveCoverImage}>
            <Text
              style={[
                styles.saveButtonText,
                isModified && styles.saveButtonTextActive,
              ]}
            >
              Save
            </Text>
          </Pressable>
        }
      />

      {/* FlatList for images */}
      <FlatList
        data={collage.images} // List of images from the context
        renderItem={renderItem}
        keyExtractor={(item) => item.image} // Use `image` path as the key
        numColumns={3} // Show images in a grid
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shotContainer: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
    marginRight: spacing,
    position: "relative",
  },
  shotImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  checkbox: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 16,
  },
  flatListContent: {
    padding: spacing,
  },
  saveButtonText: {
    color: "#696969",
    fontWeight: "600",
  },
  saveButtonTextActive: {
    color: "#6AB952",
  },
});
