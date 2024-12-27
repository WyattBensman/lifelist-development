import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";
import { authenticationStyles } from "../../../styles/authenticationStyles";
import { formStyles } from "../../../styles/formStyles";

const allowedGenders = ["MALE", "FEMALE", "PREFER NOT TO SAY"];
const fullNameRegex = /^[a-zA-Z\s]+$/;

export const validateFullName = (fullName) => {
  if (!fullNameRegex.test(fullName)) {
    throw new Error(
      "Full name must only contain alphabetic characters and spaces."
    );
  }
  return true;
};

export const validateProfileDetails = ({ fullName, gender }) => {
  validateFullName(fullName);

  if (!allowedGenders.includes(gender)) {
    throw new Error("Invalid gender. Please select a valid option.");
  }

  return true;
};

export default function SetProfileInformation() {
  const { profile, updateProfile } = useCreateProfileContext(); // Access profile and updateProfile from context
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    validateForm();
  }, [profile.fullName, profile.gender]);

  const validateForm = () => {
    try {
      validateProfileDetails({
        fullName: profile.fullName,
        gender: profile.gender,
      });
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  const handleNextStep = () => {
    try {
      validateProfileDetails({
        fullName: profile.fullName,
        gender: profile.gender,
      });

      navigation.navigate("SetProfilePicture");
    } catch (error) {
      Alert.alert("Validation Error", error.message);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={authenticationStyles.container}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Navigate back
            style={authenticationStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"}
            style={authenticationStyles.backArrow}
            onPress={handleNextStep} // Navigate to the next step only if valid
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={authenticationStyles.topContainer}>
          <Text style={authenticationStyles.stepIndicator}>2 of 4 Steps</Text>
          <View style={authenticationStyles.progressBarContainer}>
            <View style={authenticationStyles.progressBarQuarterFill} />
            <View style={authenticationStyles.progressBarQuarterEmpty} />
          </View>
        </View>

        {/* Container Middle */}
        <View style={authenticationStyles.middleContainer}>
          <Text style={authenticationStyles.stepTitle}>Step 2</Text>
          <Text style={authenticationStyles.mainTitle}>
            Profile Information
          </Text>
          <Text style={authenticationStyles.subtitle}>
            Complete your profile to let friends and family learn more about
            you.
          </Text>

          {/* Full Name Input */}
          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Full Name</Text>
            <TextInput
              style={formStyles.input}
              value={profile.fullName} // Use context value
              placeholder="Enter your full name"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("fullName", value)} // Update context
            />
          </View>

          {/* Bio Input */}
          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Bio</Text>
            <TextInput
              style={formStyles.input}
              value={profile.bio} // Use context value
              placeholder="Write a short bio"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("bio", value)} // Update context
            />
          </View>

          {/* Gender Input */}
          <View style={authenticationStyles.inputWrapper}>
            <Text style={formStyles.label}>Gender</Text>
            <TextInput
              style={formStyles.input}
              value={profile.gender} // Use context value
              placeholder="Enter your gender"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("gender", value)} // Update context
            />
          </View>

          {/* Next Step Button */}
          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Next Step"
            onPress={handleNextStep}
          />
        </View>

        {/* Container Bottom */}
        <View style={authenticationStyles.bottomContainer}>
          <Image
            source={require("../../../../assets/branding/lifelist-icon.png")}
            style={authenticationStyles.bottomLogo}
          />
        </View>
      </View>
    </View>
  );
}
