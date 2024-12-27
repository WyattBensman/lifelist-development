import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { authenticationStyles, formStyles } from "../../../styles";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";
import { VALIDATE_CONTACT_AND_BIRTHDAY } from "../../../utils/mutations";
import { useMutation } from "@apollo/client";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function SignUp() {
  const { profile, updateProfile } = useCreateProfileContext();
  const [useEmail, setUseEmail] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(""); // For display only
  const navigation = useNavigation();

  const [validateContactAndBirthday, { loading }] = useMutation(
    VALIDATE_CONTACT_AND_BIRTHDAY
  );

  // Phone Number Formatter
  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, ""); // Remove non-digit characters

    // Format for display
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${cleaned.substring(0, 3)}`;
    }
    if (cleaned.length >= 4) {
      formatted += `) ${cleaned.substring(3, 6)}`;
    }
    if (cleaned.length >= 7) {
      formatted += `-${cleaned.substring(6, 10)}`;
    }

    // Update local state for display
    setFormattedPhoneNumber(formatted);
  };

  // Email Change Handler
  const handleEmailChange = () => {
    setFormattedPhoneNumber(""); // Reset phone input when switching to email
  };

  // Open and close the date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle the selected date
  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    updateProfile("birthday", formattedDate);
    hideDatePicker();
  };

  // Check if the inputs are valid
  const validateInputs = () => {
    const phoneIsValid = formattedPhoneNumber.replace(/\D/g, "").length === 10; // Validate cleaned phone number
    const emailIsValid = profile.email.includes("@");
    const birthdayIsValid = profile.birthday.length === 10;
    setIsValid((useEmail ? emailIsValid : phoneIsValid) && birthdayIsValid);
  };

  // Reset fields on screen focus
  useFocusEffect(
    React.useCallback(() => {
      setFormattedPhoneNumber("");
      updateProfile("phoneNumber", "");
      updateProfile("email", "");
      updateProfile("birthday", "");
    }, [])
  );

  // Run validation when inputs change
  useEffect(() => {
    validateInputs();
  }, [formattedPhoneNumber, profile.email, profile.birthday]);

  const handleNextStep = async () => {
    try {
      const cleanedPhoneNumber = formattedPhoneNumber.replace(/\D/g, ""); // Clean phone number
      const [mm, dd, yyyy] = profile.birthday.split("/");
      const formattedBirthday = `${yyyy}-${mm}-${dd}`;

      // Save cleaned phoneNumber and email to the context
      if (!useEmail) {
        updateProfile("phoneNumber", cleanedPhoneNumber);
      } else {
        updateProfile("email", profile.email);
      }

      const variables = {
        email: useEmail ? profile.email : null,
        phoneNumber: !useEmail ? cleanedPhoneNumber : null,
        birthday: formattedBirthday,
      };

      const { data } = await validateContactAndBirthday({ variables });

      if (data.validateContactAndBirthday.success) {
        navigation.navigate("SetLoginInformation");
      } else {
        Alert.alert(
          "Validation Error",
          data.validateContactAndBirthday.message
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={authenticationStyles.wrapper}>
      <View style={authenticationStyles.container}>
        {/* Logo */}
        <Image
          source={require("../../../../assets/branding/lifelist-icon.png")}
          style={authenticationStyles.logo}
        />

        {/* Title */}
        <Text style={authenticationStyles.title}>Create An Account</Text>

        {/* Subtitle */}
        <Text style={authenticationStyles.subtitle}>
          Please choose your preferred sign-up method.
        </Text>

        {/* Phone Number or Email Inputs */}
        <View style={authenticationStyles.inputWrapper}>
          <View style={formStyles.inputHeader}>
            <Text style={formStyles.label}>
              {useEmail ? "Email" : "Phone Number"}
            </Text>
            <Pressable
              onPress={() => {
                setUseEmail(!useEmail);
                setFormattedPhoneNumber(""); // Reset formatted phone number
              }}
            >
              <Text style={authenticationStyles.switchText}>
                {useEmail ? (
                  <>
                    sign in with{" "}
                    <Text style={authenticationStyles.switchTypeText}>
                      phone
                    </Text>
                  </>
                ) : (
                  <>
                    sign in with{" "}
                    <Text style={authenticationStyles.switchTypeText}>
                      email
                    </Text>
                  </>
                )}
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={formStyles.input}
            value={useEmail ? profile.email : formattedPhoneNumber} // Display formatted phone number
            placeholder={useEmail ? "steve@example.com" : "(xxx)xxx-xxxx"}
            placeholderTextColor="#c7c7c7"
            keyboardType={useEmail ? "email-address" : "phone-pad"}
            onChangeText={useEmail ? handleEmailChange : handlePhoneChange}
          />
        </View>

        {/* Birthday Input */}
        <View style={formStyles.inputWrapper}>
          <Text style={formStyles.label}>Birthday</Text>
          <Pressable style={formStyles.input} onPress={showDatePicker}>
            <Text style={authenticationStyles.text}>
              {profile.birthday || "MM/DD/YYYY"}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            textColor="#fff"
          />
        </View>

        {/* Start Creation Button */}
        <ButtonSolid
          backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
          borderColor={isValid ? "#6AB952" : "#1c1c1c"}
          textColor={isValid ? "#6AB952" : "#696969"}
          width="85%"
          text="Create Account"
          onPress={isValid ? handleNextStep : null}
        />

        <Text style={authenticationStyles.orText}>or</Text>

        {/* Social Media Sign-up Options */}
        <View style={authenticationStyles.socialIconsContainer}>
          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/google-icon.webp")}
              style={authenticationStyles.googleImage}
            />
          </Pressable>

          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/apple-icon.png")}
              style={authenticationStyles.appleImage}
            />
          </Pressable>

          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/facebook-icon.webp")}
              style={authenticationStyles.facebookImage}
            />
          </Pressable>
        </View>

        {/* Sign-in Text */}
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={authenticationStyles.signInText}>
            Already have an account?{" "}
            <Text style={authenticationStyles.signInLink}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
