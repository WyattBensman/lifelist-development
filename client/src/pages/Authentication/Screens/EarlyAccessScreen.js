import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { layoutStyles } from "../../../styles";
import LockIcon from "../Icons/LockIcon"; // Ensure this icon can accept a color prop
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { VERIFY_ACCESS_CODE } from "../../../utils/mutations/accessCodeMutations";

export default function EarlyAccessScreen() {
  const [inputValue, setInputValue] = useState(""); // State to store input value
  const [accessGranted, setAccessGranted] = useState(false); // To control animation trigger
  const [isAnimating, setIsAnimating] = useState(false); // To prevent multiple presses during animation

  const navigation = useNavigation(); // Hook for navigation

  // Animation values
  const opacityValue = useState(new Animated.Value(0))[0]; // For fade-in of "Access Granted"
  const slideUpValue = useState(new Animated.Value(0))[0]; // For slide-up effect
  const welcomeOpacity = useState(new Animated.Value(0))[0]; // For "Welcome to LifeList"

  // Apollo mutation for verifying the access code
  const [verifyAccessCode, { loading }] = useMutation(VERIFY_ACCESS_CODE, {
    onCompleted: async (data) => {
      if (data.verifyAccessCode.success) {
        try {
          // Store the access code in AsyncStorage
          await AsyncStorage.setItem("earlyAccessCode", inputValue);

          // Mark the access state as unlocked
          await AsyncStorage.setItem("isEarlyAccessUnlocked", "true");
        } catch (error) {
          Alert.alert(
            "Error",
            "Unable to save access status. Please try again."
          );
          console.error("AsyncStorage error:", error);
        }
      } else {
        Alert.alert("Error", data.verifyAccessCode.message);
      }
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
      console.error("Verification error:", error);
    },
  });

  const handleInputChange = (text) => {
    setInputValue(text.toUpperCase()); // Convert input to uppercase
  };

  const runAnimation = (callback) => {
    setIsAnimating(true); // Disable further presses during animation

    // Fade in "Access Granted"
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Slide up "Access Granted" and show "Welcome to LifeList"
      Animated.timing(slideUpValue, {
        toValue: -50, // Slide up by 50px
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Fade in "Welcome to LifeList"
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 800,
        delay: 500, // Delay to show it after the slide-up
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false); // Re-enable button presses

        // Add a slight delay before navigating
        setTimeout(() => {
          callback(); // Call the navigation function after a delay
        }, 1300); // Delay of 1 second before navigating
      });
    });
  };

  const handleLockPress = async () => {
    if (!inputValue) {
      Alert.alert("Invalid Code", "Please enter a valid access code.");
      return;
    }

    if (!isAnimating && !loading) {
      try {
        const { data } = await verifyAccessCode({
          variables: { code: inputValue },
        });
        if (data.verifyAccessCode.success) {
          // Set accessGranted to true to trigger animation
          setAccessGranted(true);

          // Save to AsyncStorage
          await AsyncStorage.setItem("earlyAccessCode", inputValue);

          // Run animations and navigate
          runAnimation(() => {
            navigation.navigate("CreateAccount");
          });
        } else {
          Alert.alert("Access Denied", data.verifyAccessCode.message);
        }
      } catch (error) {
        console.error("Verify Access Code Error:", error.message);
        Alert.alert("Error", "Failed to verify access code. Please try again.");
      }
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.container}>
        {/* Use a ternary operator to hide/show content */}
        {!accessGranted ? (
          <>
            <Image
              source={require("../../../../assets/branding/lifelist-icon.png")}
              style={styles.imageLogo}
            />
            <Text style={styles.header}>Early Access</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={handleInputChange}
              autoCapitalize="characters" // Automatically capitalize input
            />

            {/* Lock Icon */}
            <LockIcon
              color={inputValue ? "#6AB952" : "#252525"}
              backgroundColor={inputValue ? "#6AB95230" : "transparent"}
              borderColor={inputValue ? "#6AB95250" : "transparent"}
              onPress={handleLockPress}
            />
          </>
        ) : (
          <>
            {/* Animated "Access Granted" Text */}
            <Animated.Text
              style={[
                styles.accessGrantedText,
                {
                  opacity: opacityValue, // Fade in effect
                  transform: [{ translateY: slideUpValue }], // Slide up effect
                },
              ]}
            >
              Access Granted
            </Animated.Text>

            {/* Stack Welcome to and LifeList Image vertically */}
            <Animated.View
              style={[styles.welcomeContainer, { opacity: welcomeOpacity }]}
            >
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Image
                source={require("../../../../assets/branding/lifelist-text.png")}
                style={styles.imageText}
              />
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.825,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 32,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  imageLogo: {
    width: 176,
    height: 144,
  },
  imageText: {
    width: 224,
    height: 53, // Adjusted for proper display size
    marginTop: 8,
  },
  input: {
    width: "70%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1.25,
    marginBottom: 12,
  },
  accessGrantedText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  welcomeContainer: {
    alignItems: "center", // Align items to the center (text + image)
    marginTop: 16,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
