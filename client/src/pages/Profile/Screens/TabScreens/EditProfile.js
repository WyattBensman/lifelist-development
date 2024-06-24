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
  TouchableOpacity,
} from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState, useEffect } from "react";
import BottomButtonContainer from "../../../../components/Containers/BottomButtonContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { UPDATE_PROFILE, UPDATE_IDENTITY } from "../../../../utils/mutations";
import { BASE_URL } from "../../../../utils/config";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";

export default function EditProfileTab() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [temporaryGender, setTemporaryGender] = useState("");

  const [fullName, setFullName] = useState(currentUser.fullName || "");
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [birthday, setBirthday] = useState(currentUser.birthday || "");
  const [gender, setGender] = useState(currentUser.gender || "");
  const [profilePicture, setProfilePicture] = useState(
    currentUser.profilePicture || ""
  );

  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);
  const [updateIdentityMutation] = useMutation(UPDATE_IDENTITY);

  useEffect(() => {
    setChangesMade(
      fullName !== currentUser.fullName ||
        username !== currentUser.username ||
        bio !== currentUser.bio ||
        birthday !== currentUser.birthday ||
        gender !== currentUser.gender ||
        profilePicture !== currentUser.profilePicture
    );
  }, [fullName, username, bio, birthday, gender, profilePicture, currentUser]);

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

      if (profilePicture !== currentUser.profilePicture) {
        const photo = {
          uri: profilePicture,
          type: "image/jpeg",
          name: "profile.jpg",
        };
        updateProfileVariables.profilePicture = photo;
      }

      const { data: profileData } = await updateProfileMutation({
        variables: updateProfileVariables,
      });

      const { data: identityData } = await updateIdentityMutation({
        variables: { gender, birthday },
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
    setFullName(currentUser.fullName || "");
    setUsername(currentUser.username || "");
    setBio(currentUser.bio || "");
    setBirthday(currentUser.birthday || "");
    setGender(currentUser.gender || "");
    setProfilePicture(currentUser.profilePicture || "");
    setChangesMade(false);
  };

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
        <View style={[layoutStyles.marginBtmSm, styles.profileContainer]}>
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profilePicture}
          />
          <Pressable onPress={pickImage}>
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </Pressable>
        </View>
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
          <TextInput
            style={styles.input}
            value={gender ? gender : "Enter your gender"}
            editable={false}
            onPressIn={() => {
              setTemporaryGender(gender); // Initialize temporary gender
              setShowGenderPicker(true);
            }}
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
            <Picker.Item label="Shiiiii idk" value="Non-binary" />
          </Picker>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={() => {
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setGender(temporaryGender);
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
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
    color: "#6AB952",
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
