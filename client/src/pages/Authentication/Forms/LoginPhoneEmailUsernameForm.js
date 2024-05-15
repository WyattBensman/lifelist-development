import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { useAuth } from "../../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../../utils/mutations/userAuthenticationMutations";

export default function LoginPhoneEmailUsernameForm({ onLoginOption }) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const [loginUser, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log("Login mutation completed, proceeding to save token");
      console.log(data.login.token);
      login(data.login.token);
    },
    onError: (err) => {
      Alert.alert("Login Error", err.message);
    },
  });

  const handleLogin = () => {
    if (!contact.trim() || !password.trim()) {
      Alert.alert("Error", "Both fields are required.");
      return;
    }
    loginUser({
      variables: { usernameOrEmailOrPhone: contact, password: password },
    });
  };

  const isFormComplete = contact.trim() && password.trim();

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.label}>Phone Number, Email or Username</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setContact}
        value={contact}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>Password</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setPassword}
        value={password}
        autoCapitalize="none"
      />
      <ButtonSolid
        text={"Login"}
        textColor={isFormComplete ? "#FFFFFF" : "#000000"}
        backgroundColor={isFormComplete ? "#6AB952" : "#ececec"}
        marginTop={12}
        onPress={handleLogin}
        disabled={loading}
      />
      <Pressable onPress={onLoginOption} style={layoutStyles.marginTopMd}>
        <Text style={{ fontSize: 12, color: "#6AB952", textAlign: "center" }}>
          Return to Options
        </Text>
      </Pressable>
    </View>
  );
}
