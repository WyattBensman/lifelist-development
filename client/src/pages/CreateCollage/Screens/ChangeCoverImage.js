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
import { useCollageContext } from "../../../contexts/CollageContext"; // Use collage context

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const shotWidth = (screenWidth - spacing * 2) / 3;
const shotHeight = (shotWidth * 3) / 2;

export default function ChangeCoverImage() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { collage, updateCollage } = useCollageContext(); // Access collage context
  const [selectedCoverImage, setSelectedCoverImage] = useState(
    collage.coverImage || collage.images[0]?.image
  );
  const [isModified, setIsModified] = useState(false);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const handleSelectCoverImage = (image) => {
    setSelectedCoverImage(image);
    setIsModified(image !== collage.coverImage);
  };

  const handleSaveCoverImage = () => {
    updateCollage({ coverImage: selectedCoverImage }); // Update cover image in context
    navigation.navigate("CollageOverview"); // Navigate back without passing params, it's now in the context
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
      <FlatList
        data={collage.images} // Access images from context
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
