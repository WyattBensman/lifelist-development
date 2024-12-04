import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import Icon from "../../../components/Icons/Icon";
import NavigableShotCard from "../Cards/NavigableShotCard";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";

export default function ViewAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumId } = route.params;
  console.log("albumId:", albumId);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [shots, setShots] = useState([]); // Store paginated shots
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { fetchPaginatedAlbumShots, removeAlbumFromCache } = useCameraAlbums();

  // Dropdown animation
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  // Fetch paginated shots
  const loadMoreShots = async () => {
    if (loading || !hasNextPage || !albumId) return;

    setLoading(true);
    try {
      const {
        shots: newShots,
        nextCursor: newCursor,
        hasNextPage: newHasNext,
      } = await fetchPaginatedAlbumShots(albumId, nextCursor);

      if (newShots.length === 0 && !newCursor) return; // Skip updates for empty data

      const uniqueShots = [
        ...shots,
        ...newShots.filter(
          (newShot) => !shots.some((shot) => shot._id === newShot._id)
        ),
      ];

      setShots(uniqueShots);
      setNextCursor(newCursor);
      setHasNextPage(newHasNext);
    } catch (error) {
      console.error("[ViewAlbum] Error loading more shots:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload album shots when screen regains focus
  useFocusEffect(
    useCallback(() => {
      loadMoreShots();
    }, [])
  );

  // Render individual shots
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
      // Call the context function to delete the album and update the cache
      await removeAlbumFromCache(albumId);
      navigation.goBack();
    } catch (error) {
      console.error("[ViewAlbum] Failed to delete album:", error);
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
          albumId,
          associatedShots: shots,
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
        title={`Album`}
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
        data={shots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
        onEndReached={loadMoreShots}
        onEndReachedThreshold={0.5} // Trigger when 50% of the list remains
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
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
