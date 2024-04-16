import { Text, TextInput, View } from "react-native";
import { formStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SetLoginInformationForm() {
  const navigation = useNavigation();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.label}>Username</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setContact}
        value={contact}
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>Password</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setPassword}
        value={password}
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>
        Confirm Password
      </Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />
      <SolidButton
        text={"Next Step"}
        backgroundColor={"#ececec"}
        marginTop={12}
        onPress={() => navigation.navigate("SetProfileInformation")}
      />
    </View>
  );
}
