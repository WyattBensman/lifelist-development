import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";

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

export default function SetProfileInformationScreen() {
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
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Navigate back
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"}
            style={iconStyles.backArrow}
            onPress={handleNextStep} // Navigate to the next step only if valid
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>2 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Container Middle */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Step 2</Text>
          <Text style={styles.mainTitle}>Profile Information</Text>
          <Text style={styles.subtitle}>
            Complete your profile to let friends and family learn more about
            you.
          </Text>

          {/* Full Name Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.fullName} // Use context value
              placeholder="Enter your full name"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("fullName", value)} // Update context
            />
          </View>

          {/* Bio Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              value={profile.bio} // Use context value
              placeholder="Write a short bio"
              placeholderTextColor="#c7c7c7"
              onChangeText={(value) => updateProfile("bio", value)} // Update context
            />
          </View>

          {/* Gender Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
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
        <View style={styles.bottomContainer}>
          <Image
            source={require("../../../../public/branding/lifelist-icon.png")}
            style={styles.logo}
          />
        </View>
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
    flex: 0.5,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarEmpty: {
    flex: 0.5,
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
    marginBottom: 6,
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
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
});
