import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { headerStyles, layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import SelectableShotCard from "../Cards/SelectableShotCard";
import { CREATE_CAMERA_ALBUM } from "../../../utils/mutations/cameraMutations";
import { useAuth } from "../../../contexts/AuthContext";
import Icon from "../../../components/Icons/Icon";

export default function CreateAlbum() {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth();
  const [selectedShots, setSelectedShots] = useState([]);
  const [changesMade, setChangesMade] = useState(false);

  // Get album title from route params
  const route = useRoute();
  const { albumTitle } = route.params;

  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [createCameraAlbum] = useMutation(CREATE_CAMERA_ALBUM);

  useEffect(() => {
    if (selectedShots.length > 0) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [selectedShots]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleCheckboxToggle = (shotId) => {
    if (selectedShots.includes(shotId)) {
      setSelectedShots(selectedShots.filter((id) => id !== shotId));
    } else {
      setSelectedShots([...selectedShots, shotId]);
    }
  };

  const saveChanges = async () => {
    try {
      const { data } = await createCameraAlbum({
        variables: {
          title: albumTitle, // Use the album title passed from the modal
          shots: selectedShots,
        },
      });

      // Update the currentUser's cameraAlbums in the AuthContext
      updateCurrentUser({
        ...currentUser,
        cameraAlbums: [...currentUser.cameraAlbums, data.createCameraAlbum],
      });

      // Navigate to the newly created album's view page by passing albumId
      navigation.navigate("ViewAlbum", { albumId: newAlbum._id });
    } catch (error) {
      console.error("Error creating camera album:", error);
    }
  };

  const renderShot = ({ item }) => (
    <SelectableShotCard
      shot={item}
      isSelected={selectedShots.includes(item._id)}
      onCheckboxToggle={handleCheckboxToggle}
    />
  );

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
});
