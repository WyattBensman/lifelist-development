import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formStyles, layoutStyles } from "../../../styles";
import ButtonSolid from "../../../components/Buttons/ButtonSolid.js";
import { useMutation } from "@apollo/client";
import { INITIALIZE_REGISTRATION } from "../../../utils/mutations/index.js";
import AuthService from "../../../utils/AuthService.js";
import { useUser } from "../../../contexts/UserContext.js";
import { useState } from "react";

export default function SignUpPhoneEmailForm({ onSignUpOption }) {
  const { setUser } = useUser();
  const navigation = useNavigation();
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [useEmail, setUseEmail] = useState(false);

  const [initializeRegistration, { data, loading, error }] = useMutation(
    INITIALIZE_REGISTRATION,
    {
      onCompleted: (data) => {
        if (data.initializeRegistration.success) {
          const { token, user } = data.initializeRegistration;

          AuthService.saveToken(token);
          setUser({ userId: user._id, token: token });

          navigation.navigate("SetLoginInformation"); // Navigate on successful registration
        } else {
          alert(data.initializeRegistration.message); // Show error message
        }
      },
      onError: (err) => {
        console.log(err);
        Alert.alert("Registration Error", err.message); // Show error alert
      },
    }
  );

  const handleSignUp = () => {
    // Basic validation
    if (!birthday || !contact) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const variables = useEmail
      ? { email: contact, phoneNumber: null, birthday }
      : { email: null, phoneNumber: contact, birthday };
    initializeRegistration({ variables });
  };

  // Determines if both fields have values to enable the button
  const isFormComplete = birthday.trim() && contact.trim();

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
          placeholder={
            useEmail ? "Enter your email" : "Enter your phone number"
          }
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
    </TouchableWithoutFeedback>
  );
}
