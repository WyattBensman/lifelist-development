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
import { useNavigation, useRoute } from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import Checkbox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const shotWidth = (screenWidth - spacing * 2) / 3; // Adjust for 3 columns
const shotHeight = (shotWidth * 3) / 2; // 2:3 ratio

export default function ChangeCoverImage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImages, currentCoverImage } = route.params;
  const [selectedCoverImage, setSelectedCoverImage] =
    useState(currentCoverImage);
  const [isModified, setIsModified] = useState(false);

  const handleSelectCoverImage = (image) => {
    setSelectedCoverImage(image);
    setIsModified(image !== currentCoverImage);
  };

  const handleSaveCoverImage = () => {
    navigation.navigate("CollageOverview", {
      selectedImages,
      coverImage: selectedCoverImage,
    });
  };

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
          <Pressable
            onPress={handleSaveCoverImage}
            style={[
              styles.saveButtonContainer,
              isModified && styles.saveButtonContainerActive,
            ]}
          >
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
      <FlatList
        data={selectedImages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={3}
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
  },
  checkbox: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 12,
  },
  saveButtonContainer: {
    backgroundColor: "#1c1c1c",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#696969",
    fontWeight: "500",
  },
  saveButtonContainerActive: {
    backgroundColor: "#6AB95230",
  },
  saveButtonTextActive: {
    color: "#6AB952",
  },
  flatListContent: {
    padding: spacing,
  },
});
