import { Pressable, Text, TextInput, View } from "react-native";
import { formStyles, layoutStyles } from "../../../styles";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";
import ButtonSkinny from "../../../components/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";

export default function SignUpPhoneEmailForm({ onSignUpOption }) {
  const navigation = useNavigation();
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [useEmail, setUseEmail] = useState(false);

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.label}>When's your birthday?</Text>
      <TextInput
        style={formStyles.input}
        onChangeText={setBirthday}
        value={birthday}
        placeholder="MM/DD/YYYY"
      />
      <View
        style={[formStyles.label, formStyles.inputSpacer, layoutStyles.flex]}
      >
        <Text>{useEmail ? "Email" : "Phone Number"}</Text>
        <Pressable onPress={() => setUseEmail(!useEmail)}>
          <Text style={formStyles.smallText}>
            sign up using{" "}
            <Text style={{ color: "#6AB952" }}>
              {useEmail ? "phone number" : "email"}
            </Text>
          </Text>
        </Pressable>
      </View>
      <TextInput
        style={formStyles.input}
        onChangeText={setContact}
        value={contact}
        placeholder={useEmail ? "Enter your email" : "Enter your phone number"}
        keyboardType={useEmail ? "email-address" : "number-pad"}
      />
      <SolidButton
        text={"Sign Up"}
        backgroundColor={"#ececec"}
        marginTop={8}
        onPress={() => navigation.navigate("VerifyAccount")}
      />
      <ButtonSkinny
        textColor={"#d4d4d4"}
        text={"Return to Options"}
        marginTop={16}
        onPress={onSignUpOption}
      />
    </View>
  );
}
