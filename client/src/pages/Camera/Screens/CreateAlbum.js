import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { headerStyles, layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import SelectableShotCard from "../Cards/SelectableShotCard";
import { CREATE_CAMERA_ALBUM } from "../../../utils/mutations/cameraMutations";
import { useAuth } from "../../../contexts/AuthContext"; // Import AuthContext
import Icon from "../../../components/Icons/Icon";

export default function CreateAlbum() {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth(); // Get currentUser and updateCurrentUser
  const [title, setTitle] = useState("");
  const [selectedShots, setSelectedShots] = useState([]);
  const [changesMade, setChangesMade] = useState(false);

  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [createCameraAlbum] = useMutation(CREATE_CAMERA_ALBUM);

  useEffect(() => {
    if (title && selectedShots.length > 0) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [title, selectedShots]);

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
          title,
          shots: selectedShots,
        },
      });

      // Update the currentUser's cameraAlbums in the AuthContext
      updateCurrentUser({
        ...currentUser,
        cameraAlbums: [...currentUser.cameraAlbums, data.createCameraAlbum],
      });

      console.log("Album created:", data.createCameraAlbum);

      navigation.navigate("Album"); // Navigate to the CameraRoll
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
        title="New Album"
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
            onPress={saveChanges}
            disabled={!changesMade}
            style={[
              styles.createButtonContainer,
              changesMade && styles.createButtonActiveContainer,
            ]}
          >
            <Text
              style={[
                styles.createButtonText,
                changesMade && styles.createButtonActiveText,
              ]}
            >
              Create
            </Text>
          </Pressable>
        }
      />
      <View
        style={[
          {
            margin: 16,
          },
        ]}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
        </View>
      </View>
      <Text style={[headerStyles.headerMedium, { marginLeft: 4 }]}>
        Select Shots
      </Text>
      <FlatList
        data={data.getAllCameraShots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    width: 72,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    flex: 1, // Make input take the remaining space
    color: "#ececec",
    height: 42,
    paddingHorizontal: 10, // Adjust padding as needed
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
  createButtonContainer: {
    backgroundColor: "#252525",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#696969",
    fontWeight: "600",
  },
  createButtonActiveContainer: {
    backgroundColor: "#6AB95230",
  },
  createButtonActiveText: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
