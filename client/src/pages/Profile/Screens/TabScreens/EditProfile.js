import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState, useEffect } from "react";
import BottomButtonContainer from "../../../../components/Containers/BottomButtonContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import { useMutation, useQuery } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { UPDATE_PROFILE, UPDATE_IDENTITY } from "../../../../utils/mutations";
import { GET_USER_PROFILE_INFORMATION } from "../../../../utils/queries"; // import your query
import { BASE_URL } from "../../../../utils/config";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons"; // Import the icon

export default function EditProfileTab() {
  const { loading, error, data } = useQuery(GET_USER_PROFILE_INFORMATION);
  const [changesMade, setChangesMade] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [temporaryGender, setTemporaryGender] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);
  const [updateIdentityMutation] = useMutation(UPDATE_IDENTITY);

  useEffect(() => {
    if (data) {
      const { getUserProfileInformation } = data;
      setFullName(getUserProfileInformation.fullName);
      setUsername(getUserProfileInformation.username);
      setBio(getUserProfileInformation.bio);
      setBirthday(getUserProfileInformation.birthday);
      setGender(getUserProfileInformation.gender);
      setProfilePicture(getUserProfileInformation.profilePicture);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const { getUserProfileInformation } = data;
      setChangesMade(
        fullName !== getUserProfileInformation.fullName ||
          username !== getUserProfileInformation.username ||
          bio !== getUserProfileInformation.bio ||
          birthday !== getUserProfileInformation.birthday ||
          gender !== getUserProfileInformation.gender ||
          profilePicture !== getUserProfileInformation.profilePicture
      );
    }
  }, [fullName, username, bio, birthday, gender, profilePicture, data]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  const saveChanges = async () => {
    try {
      const updateProfileVariables = { fullName, username, bio };

      if (profilePicture !== data.getUserProfileInformation.profilePicture) {
        const photo = {
          uri: profilePicture,
          type: "image/jpeg",
          name: "profile.jpg",
        };
        updateProfileVariables.profilePicture = photo;
      }

      const capitalize = (str) => str.toUpperCase();

      const { data: profileData } = await updateProfileMutation({
        variables: updateProfileVariables,
      });

      const { data: identityData } = await updateIdentityMutation({
        variables: { gender: capitalize(gender), birthday },
      });

      updateCurrentUser({
        profilePicture: profileData.updateProfile.profilePicture,
        fullName: profileData.updateProfile.fullName,
        username: profileData.updateProfile.username,
        bio: profileData.updateProfile.bio,
        gender: identityData.updateIdentity.gender,
        birthday: identityData.updateIdentity.birthday,
      });

      setChangesMade(false);
    } catch (error) {
      console.error("Failed to update profile information", error);
    }
  };

  const discardChanges = () => {
    if (data) {
      const { getUserProfileInformation } = data;
      setFullName(getUserProfileInformation.fullName || "");
      setUsername(getUserProfileInformation.username || "");
      setBio(getUserProfileInformation.bio || "");
      setBirthday(getUserProfileInformation.birthday || "");
      setGender(getUserProfileInformation.gender || "");
      setProfilePicture(getUserProfileInformation.profilePicture || "");
      setChangesMade(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const profilePictureUrl = `${BASE_URL}${profilePicture}`;

  return (
    <KeyboardAvoidingView
      style={layoutStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={formStyles.formContainer}
        keyboardDismissMode="on-drag"
      >
        <Text style={headerStyles.headerMedium}>Profile Information</Text>
        <Pressable
          onPress={pickImage}
          style={[layoutStyles.marginBtmSm, styles.profileContainer]}
        >
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profilePicture}
          />
          <Pressable onPress={pickImage}>
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </Pressable>
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.input}
            placeholder="Tell us about yourself"
            placeholderTextColor="#d4d4d4"
            multiline={true}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Pressable
            style={styles.genderInputContainer}
            onPress={() => {
              setTemporaryGender(gender); // Initialize temporary gender
              setShowGenderPicker(true);
            }}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={gender ? gender : "Select your gender"}
              editable={false}
              placeholderTextColor="#d4d4d4"
            />
            <MaterialIcons name="arrow-drop-down" size={24} color="#d4d4d4" />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            value={birthday ? birthday : "Enter your birthday"}
            onChangeText={setBirthday}
            placeholderTextColor="#d4d4d4"
          />
        </View>
      </ScrollView>
      {changesMade && (
        <BottomButtonContainer
          topButton={
            <SolidButton
              backgroundColor={"#6AB952"}
              text={"Save Changes"}
              textColor={"#ffffff"}
              onPress={saveChanges}
            />
          }
          bottomButton={
            <OutlinedButton
              borderColor={"#d4d4d4"}
              text={"Discard"}
              onPress={discardChanges}
            />
          }
        />
      )}

      <Modal
        isVisible={showGenderPicker}
        onBackdropPress={() => setShowGenderPicker(false)}
        style={styles.modal}
      >
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={temporaryGender}
            onValueChange={(itemValue) => setTemporaryGender(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Non-binary" value="Non-binary" />
          </Picker>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.discardButton}
              onPress={() => {
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                setGender(temporaryGender);
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  changePictureText: {
    marginLeft: 12,
    color: "#fff",
    fontWeight: "500",
  },
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
  genderInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#1C1C1C",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  pickerContainer: {
    backgroundColor: "#1C1C1C",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 48,
  },
  pickerItem: {
    color: "#ececec",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  discardButton: {
    backgroundColor: "#d4d4d4",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  discardButtonText: {
    color: "#252525",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#6AB952",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});
