import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, Animated, Alert } from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_CAMERA_ALBUM } from "../../../utils/queries/cameraQueries";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import Icon from "../../../components/Icons/Icon";
import NavigableShotCard from "../Cards/NavigableShotCard";
import { DELETE_CAMERA_ALBUM } from "../../../utils/mutations";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";

export default function ViewAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumId } = route.params;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { removeAlbumFromCache } = useCameraAlbums();
  const { data, loading, error, refetch } = useQuery(GET_CAMERA_ALBUM, {
    variables: { albumId },
  });

  const [deleteAlbum] = useMutation(DELETE_CAMERA_ALBUM);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  // Refetch the album's data when this screen gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const album = data?.getCameraAlbum;

  const renderShot = ({ item }) => (
    <NavigableShotCard shot={item} navigation={navigation} fromAlbum={true} />
  );

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDeleteAlbum = () => {
    setAlertVisible(true);
  };

  const confirmDeleteAlbum = async () => {
    setAlertVisible(false);
    try {
      const { data } = await deleteAlbum({ variables: { albumId } });

      if (data?.deleteCameraAlbum?.success) {
        removeAlbumFromCache(albumId);
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          data?.deleteCameraAlbum?.message || "Failed to delete album."
        );
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
      Alert.alert("Error", "Failed to delete album.");
    }
  };

  const dropdownItems = [
    {
      icon: "plus",
      style: iconStyles.plus,
      label: "Manage Shots",
      onPress: () =>
        navigation.navigate("ManageAlbumShots", {
          albumId: album._id,
          associatedShots: album.shots,
        }),
      backgroundColor: "#6AB95230",
      tintColor: "#6AB952",
    },
    {
      icon: "trash",
      style: iconStyles.trash,
      label: "Delete Album",
      onPress: handleDeleteAlbum,
      backgroundColor: "#E5393530",
      tintColor: "#E53935",
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
      <DangerAlert
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
        message="Are you sure you want to delete this album? This action cannot be undone."
        onConfirm={confirmDeleteAlbum}
        onCancel={() => setAlertVisible(false)}
        cancelButtonText="Discard"
      />
    </View>
  );
}
