import { Image, Text, TextInput, View } from "react-native";
import {
  formStyles,
  layoutStyles,
  authenticationStyles,
} from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SetProfileInformationForm() {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

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
      <SolidButton
        text={"Create Account"}
        backgroundColor={"#ececec"}
        marginTop={12}
        onPress={() => navigation.navigate("SetProfileInformation")}
      />
    </View>
  );
}
