import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
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
  const navigation = useNavigation();

  const [validateContactAndBirthday, { loading }] = useMutation(
    VALIDATE_CONTACT_AND_BIRTHDAY
  );

  // Phone Number Formatter
  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, "");
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

    updateProfile("phoneNumber", formatted);
  };

  // Email change handler
  const handleEmailChange = (text) => {
    updateProfile("email", text);
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
    const phoneIsValid = profile.phoneNumber.length === 14;
    const emailIsValid = profile.email.includes("@");
    const birthdayIsValid = profile.birthday.length === 10;
    setIsValid((useEmail ? emailIsValid : phoneIsValid) && birthdayIsValid);
  };

  // Reset fields on screen focus
  useFocusEffect(
    React.useCallback(() => {
      updateProfile("phoneNumber", "");
      updateProfile("email", "");
      updateProfile("birthday", "");
    }, [])
  );

  // Run validation when inputs change
  useEffect(() => {
    validateInputs();
  }, [profile.phoneNumber, profile.email, profile.birthday]);

  const handleNextStep = async () => {
    try {
      const [mm, dd, yyyy] = profile.birthday.split("/");
      const formattedBirthday = `${yyyy}-${mm}-${dd}`;

      const variables = {
        email: useEmail ? profile.email : null,
        phoneNumber: !useEmail ? profile.phoneNumber.replace(/\D/g, "") : null,
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
          source={require("../../../../public/branding/lifelist-icon.png")}
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
                updateProfile("phoneNumber", "");
                updateProfile("email", "");
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
            value={useEmail ? profile.email : profile.phoneNumber}
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
              source={require("../../../../public/branding/google-icon.webp")}
              style={styles.googleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../public/branding/apple-icon.png")}
              style={styles.appleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../public/branding/facebook-icon.webp")}
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
    color: "#c7c7c7", // Lighter gray for subtitle
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
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    color: "#fff",
  },
  switchText: {
    color: "#c7c7c7", // Gray text for the "sign in with"
    fontSize: 12,
  },
  switchTypeText: {
    color: "#6AB952", // Green text for "Email / Phone Number"
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    width: "100%", // Full width of the parent wrapper (85%)
    height: 40,
    color: "#fff", // White text
    padding: 10,
    borderRadius: 8,
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
