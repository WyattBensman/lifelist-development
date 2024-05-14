import { Text, TextInput, View, Alert } from "react-native";
import { formStyles } from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";
import { useMutation } from "@apollo/client";
import { SET_LOGIN_INFORMATION } from "../../../utils/mutations/index.js";
import { useAuth } from "../../../contexts/AuthContext.js";

export default function SetLoginInformationForm() {
  const navigation = useNavigation();
  const { setRegistrationProgress } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [setLoginInformation, { loading, error }] = useMutation(
    SET_LOGIN_INFORMATION,
    {
      onCompleted: (data) => {
        if (data.setLoginInformation.success) {
          setRegistrationProgress("profile");
          navigation.navigate("SetProfileInformation");
        } else {
          alert(data.setLoginInformation.message);
        }
      },
      onError: (err) => alert(err.message),
    }
  );

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    setUsername(trimmedUsername);

    if (!trimmedUsername || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
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
