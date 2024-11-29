import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { headerStyles, layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import SelectableShotCard from "../Cards/SelectableShotCard";
import { CREATE_CAMERA_ALBUM } from "../../../utils/mutations/cameraMutations";
import Icon from "../../../components/Icons/Icon";
import { useCameraAlbums } from "../../../contexts/CameraAlbumContext";

export default function CreateAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumTitle } = route.params; // Album title passed from the modal

  const [selectedShots, setSelectedShots] = useState([]);
  const [changesMade, setChangesMade] = useState(false);

  // Access cached albums and add functionality from the context
  const { addAlbumToCache } = useCameraAlbums();

  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [createCameraAlbum] = useMutation(CREATE_CAMERA_ALBUM);

  useEffect(() => {
    setChangesMade(selectedShots.length > 0);
  }, [selectedShots]);

  const handleCheckboxToggle = (shot) => {
    const isAlreadySelected = selectedShots.find((s) => s.shotId === shot._id);

    if (isAlreadySelected) {
      setSelectedShots((prev) => prev.filter((s) => s.shotId !== shot._id));
    } else {
      setSelectedShots((prev) => [
        ...prev,
        { shotId: shot._id, image: shot.image },
      ]);
    }
  };

  const saveChanges = async () => {
    try {
      const { data } = await createCameraAlbum({
        variables: {
          title: albumTitle,
          shots: selectedShots.map((shot) => shot.shotId),
          shotsCount: selectedShots.length,
          coverImage: selectedShots[0]?.image, // Use the first selected shot as cover
        },
      });

      const newAlbum = data.createCameraAlbum;

      // Add the new album to the cache
      await addAlbumToCache(newAlbum);

      // Navigate to the newly created album's view page
      navigation.navigate("ViewAlbum", { albumId: newAlbum._id });
    } catch (error) {
      console.error("Error creating camera album:", error);
    }
  };

  const renderShot = ({ item }) => (
    <SelectableShotCard
      shot={item}
      isSelected={!!selectedShots.find((s) => s.shotId === item._id)}
      onCheckboxToggle={() => handleCheckboxToggle(item)}
    />
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={albumTitle}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={saveChanges} disabled={!changesMade}>
            <Text
              style={[
                styles.createButtonText,
                changesMade && styles.createButtonTextActive,
              ]}
            >
              Create
            </Text>
          </Pressable>
        }
      />

      <FlatList
        data={data.getAllCameraShots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <Text
            style={[
              headerStyles.headerMedium,
              { marginLeft: 10, marginTop: 8 },
            ]}
          >
            {`Selected Shots (${selectedShots.length})`}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createButtonText: {
    fontSize: 12,
    color: "#696969",
    fontWeight: "600",
  },
  createButtonTextActive: {
    color: "#6AB952",
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  flatListContent: {
    flexGrow: 1,
  },
});
