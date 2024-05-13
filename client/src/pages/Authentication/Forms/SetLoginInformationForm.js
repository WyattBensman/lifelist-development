import { Text, TextInput, View, Alert } from "react-native";
import { formStyles } from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { SET_LOGIN_INFORMATION } from "../../../utils/mutations/index.js";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";

export default function SetLoginInformationForm() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [setLoginInformation, { data, loading, error }] = useMutation(
    SET_LOGIN_INFORMATION,
    {
      onCompleted: (data) => {
        if (data.setLoginInformation.success) {
          navigation.navigate("SetProfileInformation"); // Navigate on successful update
        } else {
          Alert.alert("Update Failed", data.setLoginInformation.message);
        }
      },
      onError: (err) => {
        Alert.alert("Registration Error", err.message);
      },
    }
  );

  const handleSubmit = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoginInformation({ variables: { username, password } });
  };

  const isFormComplete =
    username.trim() && password.trim() && confirmPassword.trim();

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.label}>Username</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
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
      <ButtonSolid
        text={"Next Step"}
        textColor={isFormComplete ? "#FFFFFF" : "#000000"}
        backgroundColor={isFormComplete ? "#6AB952" : "#ececec"}
        marginTop={12}
        onPress={handleSubmit}
        disabled={loading || !isFormComplete}
      />
    </View>
  );
}
