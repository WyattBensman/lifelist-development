import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useCallback, useState } from "react";
import LoginAuthenticationOptions from "../Components/LoginAuthenticationOptions";
import LoginPhoneEmailUsernameForm from "../Forms/LoginPhoneEmailUsernameForm";
import { useFocusEffect } from "@react-navigation/native";

export default function Login() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShowLoginForm(false);
      return () => {};
    }, [])
  );

  const toggleLoginOption = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <View style={layoutStyles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={{ width: 80, height: 80, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Text style={styles.header}>Login to LifeList</Text>
        <Text style={styles.subheader}>Early Access</Text>
        {showLoginForm ? (
          <LoginPhoneEmailUsernameForm onLoginOption={toggleLoginOption} />
        ) : (
          <LoginAuthenticationOptions onLoginOption={toggleLoginOption} />
        )}
        <Text style={styles.smallText}>
          By continuing, you agree to LifeList’s Terms of Service and confirm
          that you have read LifeList’s Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 48,
    margin: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  subheader: {
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
    color: "#6AB952",
    marginBottom: 16,
    marginTop: 6,
  },
  smallText: {
    fontSize: 10,
    textAlign: "center",
  },
});
