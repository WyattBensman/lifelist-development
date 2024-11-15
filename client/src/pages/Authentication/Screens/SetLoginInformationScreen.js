import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Image, Alert } from "react-native";
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
import CustomAlert from "../../../components/Alerts/CustomAlert";

export default function SetLoginInformationScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const navigation = useNavigation();
  const route = useRoute();
  const { userInfo } = route.params || {};

  useEffect(() => {
    validateForm();
  }, [username, password, confirmPassword]);

  const validateForm = () => {
    const isValidUsername = username.length >= 5;
    const isValidPassword =
      password.length >= 8 && password === confirmPassword;
    setIsValid(isValidUsername && isValidPassword);
  };

  const saveLoginInformation = async () => {
    try {
      const existingData = await AsyncStorage.getItem("signupData");

      const updatedData = {
        ...(existingData ? JSON.parse(existingData) : {}),
        username,
        password,
        confirmPassword,
        ...userInfo,
      };
      await AsyncStorage.setItem("signupData", JSON.stringify(updatedData));
      navigation.navigate("SetProfileInformation", { userInfo: updatedData });
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const handleBackPress = () => {
    setShowAlert(true); // Show CustomAlert when pressing back
  };

  const handleConfirmBackPress = async () => {
    await AsyncStorage.removeItem("signupData");
    await AsyncStorage.removeItem("registrationProgress");
    setShowAlert(false); // Hide the alert
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress} // Show CustomAlert when pressing back
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
            onPress={isValid ? saveLoginInformation : null} // Save and navigate only if form is valid
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Container Top */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>1 of 3 Steps</Text>
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
              value={username}
              placeholder="Enter your username"
              placeholderTextColor="#c7c7c7"
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#c7c7c7"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#c7c7c7"
                secureTextEntry={!isConfirmPasswordVisible}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Next Step"
            onPress={isValid ? saveLoginInformation : null}
          />
        </View>

        {/* Container Bottom */}
        <View style={styles.bottomContainer}>
          <Image
            source={require("../../../../public/branding/lifelist-icon.png")}
            style={styles.logo}
          />
        </View>

        {/* Custom Alert for Back Navigation */}
        <CustomAlert
          visible={showAlert}
          onRequestClose={() => setShowAlert(false)}
          title="Progress will be lost"
          message="If you go back, all your progress will be lost. Do you want to continue?"
          onConfirm={handleConfirmBackPress}
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
    flex: 0.3333,
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
