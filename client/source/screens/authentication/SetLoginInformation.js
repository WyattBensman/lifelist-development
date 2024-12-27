import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";
import { useMutation } from "@apollo/client";
import { VALIDATE_USERNAME_AND_PASSWORD } from "../../../utils/mutations";
import { authenticationStyles } from "../../../styles/authenticationStyles";
import { formStyles } from "../../../styles/formStyles";

export default function SetLoginInformation() {
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
    <View style={authenticationStyles.container}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Show DangerAlert when pressing back
            style={authenticationStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"} // Green if valid, gray if not
            style={authenticationStyles.backArrow}
            onPress={isValid ? handleNextStep : null} // Validate and navigate only if form is valid
            loading={loading} // Show loading while mutation is running
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={authenticationStyles.topContainer}>
          <Text style={authenticationStyles.stepIndicator}>1 of 4 Steps</Text>
          <View style={authenticationStyles.progressBarContainer}>
            <View style={authenticationStyles.progressBarQuarterFill} />
            <View style={authenticationStyles.progressBarQuarterEmpty} />
          </View>
        </View>

        {/* Container Middle */}
        <View style={authenticationStyles.middleContainer}>
          <Text style={authenticationStyles.stepTitle}>Step 1</Text>
          <Text style={authenticationStyles.mainTitle}>Login Information</Text>
          <Text style={authenticationStyles.subtitle}>
            Create a unique username and password to set up your account.
          </Text>

          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Username</Text>
            <TextInput
              style={formStyles.input}
              value={profile.username} // Use context value
              placeholder="Enter your username"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("username", value)} // Update context
            />
          </View>

          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Password</Text>
            <TextInput
              style={formStyles.input}
              value={profile.password} // Use context value
              placeholder="Enter your password"
              placeholderTextColor="#c7c7c7"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(value) => updateProfile("password", value)} // Update context
            />
          </View>

          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Confirm Password</Text>
            <TextInput
              style={formStyles.input}
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
        <View style={authenticationStyles.bottomContainer}>
          <Image
            source={require("../../../../assets/branding/lifelist-icon.png")}
            style={authenticationStyles.bottomLogo}
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
