import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { headerStyles, layoutStyles, formStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import ShotCard from "../Cards/ShotCard";
import { CREATE_CAMERA_ALBUM } from "../../../utils/mutations/cameraMutations";
import { useAuth } from "../../../contexts/AuthContext"; // Import AuthContext

export default function CreateAlbum() {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth(); // Get currentUser and updateCurrentUser
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedShots, setSelectedShots] = useState([]);
  const [changesMade, setChangesMade] = useState(false);

  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [createCameraAlbum] = useMutation(CREATE_CAMERA_ALBUM);

  console.log(data.getAllCameraShots);

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
          description,
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
    <ShotCard
      shot={item}
      isSelected={selectedShots.includes(item._id)}
      onCheckboxToggle={handleCheckboxToggle}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="New Album"
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <Pressable onPress={saveChanges} disabled={!changesMade}>
            <Text
              style={changesMade ? { color: "#6AB952" } : { color: "#000000" }}
            >
              Create
            </Text>
          </Pressable>
        }
      />
      <ScrollView>
        <View style={formStyles.formContainer}>
          <Text style={formStyles.label}>Title</Text>
          <TextInput
            style={formStyles.input}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
          <Text style={[formStyles.label, layoutStyles.marginTopSm]}>
            Description
          </Text>
          <TextInput
            style={formStyles.input}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
        </View>
        <Text
          style={[
            headerStyles.headerStandard,
            layoutStyles.marginLeftMd,
            layoutStyles.marginBtmSm,
          ]}
        >
          Add Shots
        </Text>
        <FlatList
          data={data.getAllCameraShots}
          renderItem={renderShot}
          keyExtractor={(item) => item._id}
          numColumns={3}
        />
      </ScrollView>
    </View>
  );
}
