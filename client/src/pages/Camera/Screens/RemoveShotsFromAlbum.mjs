import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_CAMERA_ALBUM } from "../../../utils/queries";
import { UPDATE_ALBUM_SHOTS } from "../../../utils/mutations";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function RemoveShotsFromAlbum() {
  const route = useRoute();
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { albumId } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_CAMERA_ALBUM, {
    variables: { albumId },
  });
  const [updateShots] = useMutation(UPDATE_ALBUM_SHOTS);

  const [selectedShots, setSelectedShots] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState("Remove Shots");

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useEffect(() => {
    if (data) {
      setSelectedShots(data.getCameraAlbum.shots);
      setTitle(
        data.getCameraAlbum.shots.length === 0 ? "No Shots" : "Remove Shots"
      );
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setIsModified(
        selectedShots.length !== data.getCameraAlbum.shots.length ||
          selectedShots.some(
            (shot) =>
              !data.getCameraAlbum.shots.some(
                (initialShot) => initialShot._id === shot._id
              )
          )
      );
    }
  }, [selectedShots, data]);

  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isAlreadySelected = prev.some((s) => s._id === shot._id);
      const newShots = isAlreadySelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
      return newShots;
    });
  };

  const handleSave = async () => {
    if (!isModified) return;
    try {
      await updateShots({
        variables: {
          albumId,
          shotIds: selectedShots.map((shot) => shot._id),
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

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
        title={title}
        button1={
          <Pressable onPress={handleSave} disabled={!isModified}>
            <Text
              style={[styles.buttonText, isModified && styles.buttonTextActive]}
            >
              Save
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={data.getCameraAlbum.shots}
        renderItem={({ item }) => (
          <ShotCard
            shot={item}
            isSelected={selectedShots.some((s) => s._id === item._id)}
            onCheckboxToggle={() => handleCheckboxToggle(item)}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 12,
    color: "#696969", // Inactive color
    fontWeight: "600",
  },
  buttonTextActive: {
    color: "#6AB952", // Active color when modified
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 0, // Ensures no margin on the outside
  },
});
