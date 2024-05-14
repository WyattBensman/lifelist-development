import { Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formStyles, layoutStyles } from "../../../styles";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { INITIALIZE_REGISTRATION } from "../../../utils/mutations/index.js";
import AuthService from "../../../utils/AuthService.js";
import { useAuth } from "../../../contexts/AuthContext.js";

export default function SignUpPhoneEmailForm({ onSignUpOption }) {
  const { setRegistrationProgress } = useAuth();
  const navigation = useNavigation();
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [useEmail, setUseEmail] = useState(false);

  const [initializeRegistration, { loading, error }] = useMutation(
    INITIALIZE_REGISTRATION,
    {
      onCompleted: (data) => {
        if (data.initializeRegistration.success) {
          // Save the token using AuthService and update auth context
          AuthService.saveToken(data.initializeRegistration.token);

          const storedToken = AuthService.getToken();
          console.log("Stored Token Check:", storedToken);

          setRegistrationProgress("login"); // Set registration progress to 'login'

          navigation.navigate("SetLoginInformation");
        } else {
          alert(data.initializeRegistration.message);
        }
      },
      onError: (err) => alert(err.message),
    }
  );

  const handleSignUp = () => {
    if (!isFormComplete) return;

    const variables = useEmail
      ? { email: contact, phoneNumber: null, birthday }
      : { email: null, phoneNumber: contact, birthday };

    initializeRegistration({ variables });
  };

  // Determines if both fields have values to enable the button
  const isFormComplete = birthday.trim() && contact.trim();

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
      <ButtonSolid
        text={"Sign Up"}
        textColor={isFormComplete ? "#FFFFFF" : "#000000"}
        backgroundColor={isFormComplete ? "#6AB952" : "#ececec"}
        marginTop={8}
        onPress={handleSignUp}
      />
      <Pressable onPress={onSignUpOption} style={layoutStyles.marginTopMd}>
        <Text style={{ fontSize: 12, color: "#6AB952", textAlign: "center" }}>
          Return to Options
        </Text>
      </Pressable>
    </View>
  );
}
