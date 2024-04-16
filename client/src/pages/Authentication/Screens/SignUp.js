import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { layoutStyles } from "../../../styles";
import SignUpAuthenticationOptions from "../Components/SignUpAuthenticationOptions";
import SignUpPhoneEmailForm from "../Forms/SignUpPhoneEmailForm";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function SignUp() {
  const [showPhoneEmailForm, setShowPhoneEmailForm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShowPhoneEmailForm(false);
      return () => {};
    }, [])
  );

  const toggleSignUpOption = () => {
    setShowPhoneEmailForm(!showPhoneEmailForm);
  };

  return (
    <View style={layoutStyles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={{ width: 80, height: 80, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Text style={styles.header}>Sign Up for LifeList</Text>
        <Text style={styles.subheader}>Early Access</Text>
        {showPhoneEmailForm ? (
          <SignUpPhoneEmailForm onSignUpOption={toggleSignUpOption} />
        ) : (
          <SignUpAuthenticationOptions onSignUpOption={toggleSignUpOption} />
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
