import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { formStyles } from "../../../styles";
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
    <View style={[formStyles.formContainer, { marginTop: 8 }]}>
      <View style={{ alignSelf: "center", marginBottom: 16 }}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={styles.image}
        />
        <Text style={{ marginTop: 6 }}>Change Profile Picture</Text>
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

const styles = StyleSheet.create({
  image: {
    height: 85,
    width: 85,
    borderRadius: 4,
    alignSelf: "center",
  },
});
