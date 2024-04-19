import { Image, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
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
    <View style={layoutStyles.wrapper}>
      <View style={authenticationStyles.container}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={authenticationStyles.iconLarge}
          resizeMode="contain"
        />
        <Text style={authenticationStyles.header}>Login to LifeList</Text>
        <Text style={authenticationStyles.subheader}>Early Access</Text>
        {showLoginForm ? (
          <LoginPhoneEmailUsernameForm onLoginOption={toggleLoginOption} />
        ) : (
          <LoginAuthenticationOptions onLoginOption={toggleLoginOption} />
        )}
      </View>
    </View>
  );
}
