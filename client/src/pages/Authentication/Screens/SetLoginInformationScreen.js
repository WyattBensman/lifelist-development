import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Image, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";
import { useMutation } from "@apollo/client";
import { VALIDATE_USERNAME_AND_PASSWORD } from "../../../utils/mutations";

export default function SetLoginInformationScreen() {
  const { profile, updateProfile, resetProfile } = useCreateProfileContext(); // Access profile and updateProfile from context
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState(""); // Local state for confirm password
  const [isValid, setIsValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const navigation = useNavigation();

  // Apollo Mutation
  const [validateUsernameAndPassword, { loading }] = useMutation(
    VALIDATE_USERNAME_AND_PASSWORD
  );

  useEffect(() => {
    validateForm();
  }, [profile.username, profile.password, confirmPassword]);

  const validateForm = () => {
    const isValidUsername = profile.username.length >= 5;
    const isValidPassword =
      profile.password.length >= 8 && profile.password === confirmPassword;
    setIsValid(isValidUsername && isValidPassword);
  };

  const handleNextStep = async () => {
    if (!isValid) return;

    try {
      // Validate username and password via GraphQL
      const { data } = await validateUsernameAndPassword({
        variables: {
          username: profile.username,
          password: profile.password,
        },
      });

      if (!data.validateUsernameAndPassword.success) {
        Alert.alert(
          "Validation Error",
          data.validateUsernameAndPassword.message
        );
        return;
      }

      // Navigate to the next screen if validation is successful
      navigation.navigate("SetProfileInformation");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Error validating username and password:", error);
    }
  };

  const handleBackPress = () => {
    setShowAlert(true); // Show DangerAlert when pressing back
  };

  const handleConfirmBackPress = () => {
    setShowAlert(false); // Hide the alert
    navigation.goBack(); // Navigate back to the previous screen
    resetProfile();
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Show DangerAlert when pressing back
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"} // Green if valid, gray if not
            style={iconStyles.backArrow}
            onPress={isValid ? handleNextStep : null} // Validate and navigate only if form is valid
            loading={loading} // Show loading while mutation is running
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>1 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Container Middle */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Step 1</Text>
          <Text style={styles.mainTitle}>Login Information</Text>
          <Text style={styles.subtitle}>
            Create a unique username and password to set up your account.
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={profile.username} // Use context value
              placeholder="Enter your username"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("username", value)} // Update context
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={profile.password} // Use context value
              placeholder="Enter your password"
              placeholderTextColor="#c7c7c7"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(value) => updateProfile("password", value)} // Update context
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword} // Local state
              placeholder="Confirm your password"
              placeholderTextColor="#c7c7c7"
              secureTextEntry={!isConfirmPasswordVisible}
              onChangeText={(value) => setConfirmPassword(value)} // Update local state
            />
          </View>

          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Next Step"
            onPress={isValid ? handleNextStep : null}
          />
        </View>

        {/* Container Bottom */}
        <View style={styles.bottomContainer}>
          <Image
            source={require("../../../../public/branding/lifelist-icon.png")}
            style={styles.logo}
          />
        </View>

        {/* DangerAlert for Back Navigation */}
        <DangerAlert
          visible={showAlert}
          onRequestClose={() => setShowAlert(false)}
          title="Progress will be lost"
          message="If you go back, all your progress will be lost. Do you want to continue?"
          onConfirm={handleConfirmBackPress} // Action for "Leave"
          onCancel={() => setShowAlert(false)} // Action for "Discard"
          confirmButtonText="Leave"
          cancelButtonText="Discard"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    marginTop: -4,
  },
  stepIndicator: {
    color: "#6AB952",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    flexDirection: "row",
    marginBottom: 24,
  },
  progressBarFilled: {
    flex: 0.25,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarEmpty: {
    flex: 0.75,
    backgroundColor: "#1c1c1c",
  },
  middleContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 84,
  },
  stepTitle: {
    color: "#6AB952",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "left",
    width: "80%",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    width: "80%",
    marginBottom: 8,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 14,
    textAlign: "left",
    width: "80%",
    marginBottom: 24,
  },
  inputWrapper: {
    width: "80%",
    marginBottom: 16,
    alignSelf: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#252525",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    width: "100%",
  },
  passwordWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyeIcon: {
    color: "#6AB952",
    fontSize: 16,
    padding: 8,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
});
