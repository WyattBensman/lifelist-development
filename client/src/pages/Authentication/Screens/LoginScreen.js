import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import navigation hook and useFocusEffect
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../../utils/mutations/userAuthenticationMutations";
import { useAuth } from "../../../contexts/AuthContext"; // Auth context for handling login
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { layoutStyles } from "../../../styles";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState(""); // For email, phone, or username
  const [password, setPassword] = useState(""); // State for password input
  const [isValid, setIsValid] = useState(false); // Track if inputs are valid
  const navigation = useNavigation(); // Hook for navigation
  const { login } = useAuth();

  // Apollo login mutation
  const [loginUser, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.token); // Use login from the AuthContext to store token
    },
    onError: (err) => {
      Alert.alert("Login Error", err.message);
    },
  });

  // Function to check if input is an email
  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  // Function to check if input is a phone number
  const isPhoneNumber = (input) => /^\(\d{3}\) \d{3}-\d{4}$/.test(input);

  // Function to validate if the input is a username
  const isUsername = (input) => /^[a-zA-Z0-9._-]{3,16}$/.test(input);

  // Phone Number Formatter
  const handleIdentifierChange = (text) => {
    if (isPhoneNumber(text)) {
      let cleaned = text.replace(/\D/g, ""); // Remove non-numeric characters
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
      setIdentifier(formatted);
    } else {
      setIdentifier(text);
    }
  };

  // Validate email, phone, or username along with password
  const validateInputs = () => {
    const isIdentifierValid =
      isEmail(identifier) ||
      isPhoneNumber(identifier) ||
      isUsername(identifier);
    const passwordIsValid = password.length >= 6; // Minimum 6 characters for password
    setIsValid(isIdentifierValid && passwordIsValid);
  };

  // Handle login action
  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert("Error", "Both fields are required.");
      return;
    }
    loginUser({
      variables: { usernameOrEmailOrPhone: identifier, password: password },
    });
  };

  // Reset fields on screen focus (using useFocusEffect)
  useFocusEffect(
    React.useCallback(() => {
      // Reset all fields when screen is focused
      setIdentifier("");
      setPassword("");
    }, [])
  );

  // Run validation when inputs change
  useEffect(() => {
    validateInputs();
  }, [identifier, password]);

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../../../public/branding/lifelist-icon.png")}
          style={styles.logo}
        />
        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        {/* Subtitle */}
        <Text style={styles.subtitle}>We've missed you!</Text>
        {/* Single Input for Email, Phone, or Username */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputHeader}>
            <Text style={styles.label}>Email, Phone, or Username</Text>
          </View>

          <TextInput
            style={styles.input}
            value={identifier}
            placeholder="Enter valid credentials"
            placeholderTextColor="#c7c7c7"
            keyboardType="default"
            onChangeText={handleIdentifierChange} // Apply formatting for phone or set email/username
          />
        </View>
        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { marginBottom: 8 }]}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor="#c7c7c7"
            secureTextEntry={true} // Password hidden
            onChangeText={setPassword} // Handle password input
          />
        </View>
        {/* Login Button */}
        <ButtonSolid
          backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"} // Green when valid, dark gray when not
          borderColor={isValid ? "#6AB95250" : "#1c1c1c"} // Green border when valid
          textColor={isValid ? "#6AB952" : "#696969"} // White when valid, gray when not
          width="85%"
          text="Log In"
          onPress={isValid ? handleLogin : null} // Only active if valid
          disabled={loading} // Disable button while loading
        />
        {error && <Text style={{ color: "red" }}>{error.message}</Text>}
        {/* Error Message */}
        <Text style={styles.orText}>or</Text>
        {/* Social Media Login Options */}
        <View style={styles.socialIconsContainer}>
          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../public/branding/google-icon.webp")} // Replace with your Google icon
              style={styles.googleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../public/branding/apple-icon.png")} // Replace with your Apple icon
              style={styles.appleImage}
            />
          </Pressable>

          <Pressable style={styles.socialIcon}>
            <Image
              source={require("../../../../public/branding/facebook-icon.webp")} // Replace with your Facebook icon
              style={styles.facebookImage}
            />
          </Pressable>
        </View>
        {/* Create Account Link */}
        <Pressable onPress={() => navigation.navigate("CreateAccount")}>
          <Text style={styles.signInText}>
            Don't have an account?{" "}
            <Text style={styles.signInLink}>Sign Up</Text>
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
    color: "#c7c7c7", // Gray text for "Don't have an account?"
    fontSize: 12,
    marginTop: 48,
  },
  signInLink: {
    color: "#6AB952", // Green text for "Create One" link
    fontWeight: "700",
  },
});
