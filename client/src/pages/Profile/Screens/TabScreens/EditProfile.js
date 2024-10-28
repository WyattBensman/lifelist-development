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
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { UPDATE_PROFILE, UPDATE_IDENTITY } from "../../../../utils/mutations";
import { GET_USER_PROFILE_INFORMATION } from "../../../../utils/queries";
import { BASE_URL } from "../../../../utils/config";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import IconStatic from "../../../../components/Icons/IconStatic";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfileTab({
  setUnsavedChanges,
  registerResetChanges,
}) {
  const { loading, error, data, refetch } = useQuery(
    GET_USER_PROFILE_INFORMATION
  );
  const [changesMade, setChangesMade] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [temporaryGender, setTemporaryGender] = useState("");
  const [temporaryBirthday, setTemporaryBirthday] = useState(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);
  const [updateIdentityMutation] = useMutation(UPDATE_IDENTITY);

  // Cache keys for AsyncStorage
  const cacheKeys = {
    fullName: "profile_fullName",
    username: "profile_username",
    bio: "profile_bio",
    profilePicture: "profile_profilePicture",
  };

  // Initialize profile info from the server data
  const initializeProfileInfo = useCallback(() => {
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

  // Register the resetChanges function with the navigator
  useEffect(() => {
    registerResetChanges(initializeProfileInfo);
  }, [registerResetChanges, initializeProfileInfo]);

  useEffect(() => {
    initializeProfileInfo();
  }, [data, initializeProfileInfo]);

  useEffect(() => {
    if (data) {
      const { getUserProfileInformation } = data;
      const hasChanges =
        fullName !== getUserProfileInformation.fullName ||
        username !== getUserProfileInformation.username ||
        bio !== getUserProfileInformation.bio ||
        birthday !== getUserProfileInformation.birthday ||
        gender !== getUserProfileInformation.gender ||
        profilePicture !== getUserProfileInformation.profilePicture;

      setChangesMade(hasChanges);
      setUnsavedChanges(hasChanges);
    }
  }, [
    fullName,
    username,
    bio,
    birthday,
    gender,
    profilePicture,
    data,
    setUnsavedChanges,
  ]);

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

      const capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

      const { data: profileData } = await updateProfileMutation({
        variables: updateProfileVariables,
      });

      const { data: identityData } = await updateIdentityMutation({
        variables: { gender: capitalize(gender), birthday },
      });

      // Update local state with the saved values
      setFullName(profileData.updateProfile.fullName);
      setUsername(profileData.updateProfile.username);
      setBio(profileData.updateProfile.bio);
      setProfilePicture(profileData.updateProfile.profilePicture);
      setGender(identityData.updateIdentity.gender);
      setBirthday(identityData.updateIdentity.birthday);

      // Update cache in AsyncStorage
      await AsyncStorage.multiSet([
        [cacheKeys.fullName, profileData.updateProfile.fullName],
        [cacheKeys.username, profileData.updateProfile.username],
        [cacheKeys.bio, profileData.updateProfile.bio],
        [cacheKeys.profilePicture, profileData.updateProfile.profilePicture],
      ]);

      setChangesMade(false);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to update profile information", error);
    }
  };

  const discardChanges = () => {
    initializeProfileInfo(); // Reset to original values
    setChangesMade(false);
    setUnsavedChanges(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const [month, day, year] = formattedDate.split(" ");
    const dayWithSuffix = day
      .replace(",", "")
      .concat(getDaySuffix(parseInt(day)));
    return `${month} ${dayWithSuffix}, ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleBirthdaySave = () => {
    if (temporaryBirthday) {
      setBirthday(temporaryBirthday);
      setShowBirthdayPicker(false);
    }
  };

  const handleBirthdayDiscard = () => {
    setShowBirthdayPicker(false);
    setTemporaryBirthday(null);
  };

  const profilePictureUrl = `${BASE_URL}${profilePicture}`;

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <KeyboardAvoidingView
      style={layoutStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={formStyles.formContainer}
        keyboardDismissMode="on-drag"
      >
        <Text style={[headerStyles.headerMedium, { marginBottom: 12 }]}>
          Profile Information
        </Text>
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
            style={styles.input}
            onPress={() => {
              setTemporaryGender(gender);
              setShowGenderPicker(true);
            }}
          >
            <Text style={{ color: gender ? "#fff" : "#d4d4d4" }}>
              {gender
                ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
                : "Select your gender"}
            </Text>
            <IconStatic
              name="chevron.down"
              style={styles.icon}
              tintColor="#d4d4d4"
              weight="regular"
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Birthday</Text>
          <Pressable
            style={styles.input}
            onPress={() => {
              setTemporaryBirthday(new Date(birthday));
              setShowBirthdayPicker(true);
            }}
          >
            <Text style={{ color: birthday ? "#fff" : "#d4d4d4" }}>
              {birthday ? formatDate(birthday) : "Select your birthday"}
            </Text>
            <IconStatic
              name="chevron.down"
              style={styles.icon}
              tintColor="#d4d4d4"
              weight="regular"
            />
          </Pressable>
        </View>
      </ScrollView>
      {changesMade && (
        <EditProfileBottomContainer
          saveChanges={saveChanges}
          discardChanges={discardChanges}
        />
      )}

      {/* Gender Picker Modal */}
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
              onPress={() => setShowGenderPicker(false)}
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

      {/* Birthday Picker Modal */}
      {showBirthdayPicker && (
        <Modal
          isVisible={showBirthdayPicker}
          onBackdropPress={handleBirthdayDiscard}
          style={styles.modal}
        >
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={temporaryBirthday || new Date()}
              mode="date"
              display="spinner"
              textColor="#fff"
              onChange={(event, selectedDate) =>
                setTemporaryBirthday(selectedDate)
              }
              style={{ width: "100%" }}
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.discardButton}
                onPress={handleBirthdayDiscard}
              >
                <Text style={styles.discardButtonText}>Discard</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleBirthdaySave}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    width: 76,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    padding: 9,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 16,
    height: 10,
    marginRight: 2,
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
    marginTop: 8,
  },
  discardButton: {
    flex: 1,
    height: 35,
    marginRight: 10,
    backgroundColor: "#252525",
    borderColor: "#d4d4d4",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  discardButtonText: {
    color: "#d4d4d4",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    height: 35,
    marginLeft: 10,
    backgroundColor: "#6AB95230",
    borderColor: "#6AB95250",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
