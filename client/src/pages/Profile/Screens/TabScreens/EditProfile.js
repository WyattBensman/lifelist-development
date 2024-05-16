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
import { useAuth } from "../../../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { UPDATE_PROFILE, UPDATE_IDENTITY } from "../../../../utils/mutations";

export default function EditProfileTab() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [changesMade, setChangesMade] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={layoutStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={formStyles.formContainer}
        keyboardDismissMode="on-drag"
      >
        <View style={[layoutStyles.marginBtmSm, { alignItems: "center" }]}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
          <Pressable onPress={pickImage}>
            <Text style={layoutStyles.marginTopXxs}>
              Change Profile Picture
            </Text>
          </Pressable>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={formStyles.input}
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={formStyles.input}
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={formStyles.input}
            multiline={true}
          />
        </View>

        <Text style={[headerStyles.headerMedium, { marginTop: 8 }]}>
          Personal Information
        </Text>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Birthday</Text>
          <TextInput
            value={birthday}
            onChangeText={setBirthday}
            style={formStyles.input}
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            style={formStyles.input}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    height: 85,
    width: 85,
    borderRadius: 4,
  },
});
