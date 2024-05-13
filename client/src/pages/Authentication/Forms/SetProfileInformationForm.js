import { Image, Text, TextInput, View } from "react-native";
import {
  formStyles,
  layoutStyles,
  authenticationStyles,
} from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { SET_PROFILE_INFORMATION } from "../../../utils/mutations/index.js";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function SetProfileInformationForm() {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const [setProfileInformation, { loading }] = useMutation(
    SET_PROFILE_INFORMATION,
    {
      onCompleted: (data) => {
        if (data.setProfileInformation.success) {
          Alert.alert("Success", "Profile updated successfully.");
          navigation.navigate("'MainFeed'"); // Specify the next screen to navigate
        }
      },
      onError: (error) => {
        Alert.alert("Update Failed", error.message);
      },
    }
  );

  const handleUpdateProfile = () => {
    if (!fullName || !gender) {
      Alert.alert("Error", "Full name and gender are required.");
      return;
    }

    setProfileInformation({
      variables: {
        fullName,
        gender,
        bio,
        profilePicture,
      },
    });
  };

  const isFormComplete =
    fullName.trim() && gender.trim() && profilePicture.trim();

  return (
    <View style={[formStyles.formContainer, layoutStyles.marginTopXs]}>
      <View style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={authenticationStyles.profilePictureContainer}
        />
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
        onPress={() => navigation.navigate("SetProfileInformation")}
      />
    </View>
  );
}
