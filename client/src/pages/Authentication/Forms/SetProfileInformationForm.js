import { Image, Text, TextInput, View, Alert } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { useMutation } from "@apollo/client";
import { SET_PROFILE_INFORMATION } from "../../../utils/mutations/index.js";
import { useAuth } from "../../../contexts/AuthContext.js";

export default function SetProfileInformationForm() {
  const navigation = useNavigation();
  const { setIsAuthenticated, setRegistrationComplete } = useAuth();
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const [setProfileInformation, { loading, error }] = useMutation(
    SET_PROFILE_INFORMATION,
    {
      onCompleted: (data) => {
        if (data.setProfileInformation.success) {
          setIsAuthenticated(true); // Mark the user as fully authenticated
          setRegistrationComplete(true); // Indicate that registration is complete
        } else {
          Alert.alert("Error", data.setProfileInformation.message);
        }
      },
      onError: (err) => Alert.alert("Error", err.message),
    }
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim() || !gender.trim()) {
      Alert.alert("Error", "Full name and gender are required.");
      return;
    }

    const variables = {
      profilePicture: image,
      fullName,
      gender,
      bio,
    };
    setProfileInformation({ variables });
  };

  const isFormComplete = fullName.trim() && gender.trim();

  return (
    <View style={[formStyles.formContainer, layoutStyles.marginTopXs]}>
      <View style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}>
        <ButtonSolid onPress={pickImage} text="Pick an image" />
        {image && (
          <Image
            source={{ uri: image }}
            style={authenticationStyles.profilePictureContainer}
          />
        )}
        <Text style={layoutStyles.marginTopXs}>Set Profile Picture</Text>
      </View>
      <Text style={formStyles.label}>Full Name</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setFullName}
        value={fullName}
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>Gender</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setGender}
        value={gender}
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>Bio</Text>
      <TextInput style={formStyles.input} onChangeText={setBio} value={bio} />
      <ButtonSolid
        text={"Create Account"}
        textColor={isFormComplete ? "#FFFFFF" : "#000000"}
        backgroundColor={isFormComplete ? "#6AB952" : "#ececec"}
        marginTop={12}
        onPress={handleSubmit}
      />
    </View>
  );
}
