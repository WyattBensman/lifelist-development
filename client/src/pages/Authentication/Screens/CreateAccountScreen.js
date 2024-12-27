import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { layoutStyles } from "../../../styles";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";
import { VALIDATE_CONTACT_AND_BIRTHDAY } from "../../../utils/mutations";
import { useMutation } from "@apollo/client";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreateAccountScreen() {
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
  const handleEmailChange = (text) => {
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
    <View style={layoutStyles.wrapper}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../../../assets/branding/lifelist-icon.png")}
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>Create An Account</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Please choose your preferred sign-up method.
        </Text>

        {/* Phone Number or Email Inputs */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputHeader}>
            <Text style={styles.label}>
              {useEmail ? "Email" : "Phone Number"}
            </Text>
            <Pressable
              onPress={() => {
                setUseEmail(!useEmail);
                setFormattedPhoneNumber(""); // Reset formatted phone number
              }}
            >
              <Text style={styles.switchText}>
                {useEmail ? (
                  <>
                    sign in with{" "}
                    <Text style={styles.switchTypeText}>phone</Text>
                  </>
                ) : (
                  <>
                    sign in with{" "}
                    <Text style={styles.switchTypeText}>email</Text>
                  </>
                )}
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            value={useEmail ? profile.email : formattedPhoneNumber} // Display formatted phone number
            placeholder={useEmail ? "steve@example.com" : "(xxx)xxx-xxxx"}
            placeholderTextColor="#c7c7c7"
            keyboardType={useEmail ? "email-address" : "phone-pad"}
            onChangeText={useEmail ? handleEmailChange : handlePhoneChange}
          />
        </View>

        {/* Birthday Input */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { marginBottom: 8 }]}>Birthday</Text>
          <Pressable style={styles.input} onPress={showDatePicker}>
            <Text style={{ color: "#fff" }}>
              {profile.birthday || "MM/DD/YYYY"}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            textColor="#fff"
            buttonTextColorIOS="#fff"
            pickerContainerStyleIOS={{
              justifycontent: "center",
              alignItems: "center",
            }}
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

        <Text style={styles.orText}>or</Text>

        {/* Social Media Sign-up Options */}
        <View style={styles.socialIconsContainer}>
          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/google-icon.webp")}
              style={styles.googleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/apple-icon.png")}
              style={styles.appleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/facebook-icon.webp")}
              style={styles.facebookImage}
            />
          </Pressable>
        </View>

        {/* Sign-in Text */}
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 60, // Adjust width to fit
    height: 52, // Adjust height to fit
    marginBottom: 16,
  },
  title: {
    color: "#fff", // White text
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#696969", // Lighter gray for subtitle
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    marginHorizontal: 42,
  },
  inputWrapper: {
    width: "85%", // Ensures input fields take up 85% of the screen width
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: "row", // Align label and switch text horizontally
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  switchText: {
    color: "#696969", // Gray text for the "sign in with"
    fontSize: 12,
  },
  switchTypeText: {
    color: "#6AB952", // Green text for "Email / Phone Number"
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    width: "100%",
    color: "#fff", // White text
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#252525", // Dark background for the input
  },
  orText: {
    color: "#c7c7c7", // Gray for "or" text
    marginVertical: 12,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
  },
  googleImage: {
    width: 40,
    height: 40,
  },
  facebookImage: {
    width: 46,
    height: 46,
  },
  appleImage: {
    width: 22,
    height: 26,
    marginBottom: 2,
  },
  signInText: {
    color: "#c7c7c7", // Gray text for "Already have an account?"
    fontSize: 12,
    marginTop: 48,
  },
  signInLink: {
    color: "#6AB952", // Green text for "Sign In" link
    fontWeight: "700",
  },
});
