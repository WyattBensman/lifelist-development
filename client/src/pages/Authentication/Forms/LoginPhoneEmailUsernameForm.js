import { Pressable, Text, TextInput, View } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";
import ButtonSkinny from "../../../components/ButtonSkinny";

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
      />
      <Text style={[formStyles.label, formStyles.inputSpacer]}>Password</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setPassword}
        value={password}
      />
      <SolidButton text={"Login"} backgroundColor={"#ececec"} marginTop={12} />
      <ButtonSkinny
        textColor={"#d4d4d4"}
        text={"Return to Options"}
        marginTop={16}
        onPress={onLoginOption}
      />
    </View>
  );
}
