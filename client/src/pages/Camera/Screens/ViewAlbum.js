import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import ShotCard from "../Cards/ShotCard";
import { GET_CAMERA_ALBUM } from "../../../utils/queries/cameraQueries";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import Icon from "../../../components/Icons/Icon";

export default function ViewAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumId } = route.params;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { data, loading, error } = useQuery(GET_CAMERA_ALBUM, {
    variables: { albumId },
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const album = data.getCameraAlbum;

  const renderShot = ({ item }) => <ShotCard shot={item} />;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const dropdownItems = [
    {
      icon: "plus",
      style: iconStyles.plus,
      label: "Add Shots",
      onPress: () => console.log("Add Shots to Album"),
      backgroundColor: "#6AB95230", // Add backgroundColor
      tintColor: "#6AB952", // Add tintColor
    },
    {
      icon: "pencil.slash",
      style: iconStyles.removeShots,
      label: "Remove Shots",
      onPress: () => console.log("Remove Shots from Album"),
      backgroundColor: "#5FC4ED30", // Add backgroundColor
      tintColor: "#5FC4ED", // Add tintColor
    },
    {
      icon: "trash",
      style: iconStyles.trash,
      label: "Delete Album",
      onPress: () => console.log("Delete Album"),
      backgroundColor: "#E5393530", // Very Light Pink Background
      tintColor: "#E53935", // Slightly Darker Red
    },
  ];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={album.title}
        button1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={toggleDropdown}
            />
          </Animated.View>
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <FlatList
        data={album.shots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
      />
    </View>
  );
}
