import { Pressable, Text, TextInput, View } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";

export default function LoginPhoneEmailUsernameForm({ onLoginOption }) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

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
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <SolidButton text={"Login"} backgroundColor={"#ececec"} marginTop={12} />
      <Pressable onPress={onLoginOption} style={layoutStyles.marginTopMd}>
        <Text style={{ fontSize: 12, color: "#6AB952", textAlign: "center" }}>
          Return to Options
        </Text>
      </Pressable>
    </View>
  );
}
