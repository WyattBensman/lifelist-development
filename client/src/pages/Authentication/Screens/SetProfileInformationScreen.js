import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";

export default function SetProfileInformationScreen() {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();

  // Load saved data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const savedData = await AsyncStorage.getItem("signupData");

          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFullName(parsedData.fullName || "");
            setBio(parsedData.bio || "");
            setGender(parsedData.gender || "");
          }
        } catch (error) {
          console.error("Error loading data from AsyncStorage:", error);
        }
      };
      loadData();
    }, [])
  );

  // Save data to AsyncStorage whenever input changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const existingData = await AsyncStorage.getItem("signupData");
        const updatedData = {
          ...(existingData ? JSON.parse(existingData) : {}),
          fullName,
          bio,
          gender,
        };
        await AsyncStorage.setItem("signupData", JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
      }
    };

    saveData(); // Call saveData whenever any of the input fields change
  }, [fullName, bio, gender]);

  // Validate form whenever input fields change
  useEffect(() => {
    validateForm();
  }, [fullName, bio, gender]);

  const validateForm = () => {
    const isValidFullName = fullName.length > 2;
    const isValidGender = gender !== "";
    setIsValid(isValidFullName && isValidGender);
  };

  // Save data and proceed to next step
  const saveProfileInformation = async () => {
    try {
      const existingData = await AsyncStorage.getItem("signupData");
      const updatedData = {
        ...(existingData ? JSON.parse(existingData) : {}),
        fullName,
        bio,
        gender,
      };

      // Save the updated profile data to AsyncStorage
      await AsyncStorage.setItem("signupData", JSON.stringify(updatedData));

      // Update the registration progress to indicate that user reached this step
      await AsyncStorage.setItem("registrationProgress", "SetPermissions");

      // Navigate to the next step
      navigation.navigate("SetPermissions");
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  // Save data when navigating back to the previous screen
  const handleBackPress = async () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error("Error saving data before navigating back:", error);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Save data when pressing the back arrow
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
            onPress={isValid ? saveProfileInformation : null} // Save and navigate only if form is valid
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>2 of 2 Steps</Text>
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
              value={fullName}
              placeholder="Enter your full name"
              placeholderTextColor="#c7c7c7"
              onChangeText={setFullName}
            />
          </View>

          {/* Bio Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              value={bio}
              placeholder="Write a short bio"
              placeholderTextColor="#c7c7c7"
              onChangeText={setBio}
            />
          </View>

          {/* Gender Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              value={gender}
              placeholder="Enter your gender"
              placeholderTextColor="#c7c7c7"
              onChangeText={setGender}
            />
          </View>

          {/* Next Step Button */}
          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Next Step"
            onPress={isValid ? saveProfileInformation : null}
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
