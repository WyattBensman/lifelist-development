import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../../utils/mutations/userAuthenticationMutations";
import { useAuth } from "../../../contexts/AuthContext";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { authenticationStyles, formStyles } from "../../../styles";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // For email, phone, or username
  const [password, setPassword] = useState(""); // State for password input
  const [isValid, setIsValid] = useState(false); // Track if inputs are valid
  const navigation = useNavigation(); // Hook for navigation
  const { login } = useAuth();

  // Apollo login mutation
  const [loginUser, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.token);
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

  // Reset fields on screen focus
  useFocusEffect(
    React.useCallback(() => {
      setIdentifier("");
      setPassword("");
    }, [])
  );

  // Run validation when inputs change
  useEffect(() => {
    validateInputs();
  }, [identifier, password]);

  return (
    <View style={authenticationStyles.wrapper}>
      <View style={authenticationStyles.container}>
        {/* Logo */}
        <Image
          source={require("../../../../assets/branding/lifelist-icon.png")}
          style={authenticationStyles.mainLogo}
        />
        {/* Title */}
        <Text style={authenticationStyles.title}>Welcome Back</Text>
        {/* Subtitle */}
        <Text style={authenticationStyles.subtitle}>We've missed you!</Text>
        {/* Input for Email, Phone, or Username */}
        <View style={authenticationStyles.inputWrapper}>
          <Text style={formStyles.label}>Email, Phone, or Username</Text>
          <TextInput
            style={formStyles.input}
            value={identifier}
            placeholder="Enter valid credentials"
            placeholderTextColor="#c7c7c7"
            keyboardType="default"
            onChangeText={handleIdentifierChange}
          />
        </View>
        {/* Password Input */}
        <View style={formStyles.inputWrapper}>
          <Text style={formStyles.label}>Password</Text>
          <TextInput
            style={formStyles.input}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor="#c7c7c7"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        {/* Login Button */}
        <ButtonSolid
          backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
          borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
          textColor={isValid ? "#6AB952" : "#696969"}
          width="85%"
          text="Log In"
          onPress={isValid ? handleLogin : null}
          disabled={loading}
        />
        {error && <Text style={{ color: "red" }}>{error.message}</Text>}
        <Text style={authenticationStyles.orText}>or</Text>
        {/* Social Media Login Options */}
        <View style={authenticationStyles.socialIconsContainer}>
          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/google-icon.webp")}
              style={authenticationStyles.googleImage}
            />
          </Pressable>

          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/apple-icon.png")}
              style={authenticationStyles.appleImage}
            />
          </Pressable>

          <Pressable style={authenticationStyles.socialIcon}>
            <Image
              source={require("../../../../assets/logos/facebook-icon.webp")}
              style={authenticationStyles.facebookImage}
            />
          </Pressable>
        </View>
        {/* Create Account Link */}
        <Pressable onPress={() => navigation.navigate("CreateAccount")}>
          <Text style={authenticationStyles.signInText}>
            Don't have an account?{" "}
            <Text style={authenticationStyles.signInLink}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
