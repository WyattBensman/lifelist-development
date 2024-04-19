import { Image, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import SignUpAuthenticationOptions from "../Components/SignUpAuthenticationOptions";
import SignUpPhoneEmailForm from "../Forms/SignUpPhoneEmailForm";

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
    <View style={layoutStyles.wrapper}>
      <View style={authenticationStyles.container}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={authenticationStyles.iconLarge}
          resizeMode="contain"
        />
        <Text style={authenticationStyles.header}>Sign Up for LifeList</Text>
        <Text style={authenticationStyles.subheader}>Early Access</Text>
        {showPhoneEmailForm ? (
          <SignUpPhoneEmailForm onSignUpOption={toggleSignUpOption} />
        ) : (
          <SignUpAuthenticationOptions onSignUpOption={toggleSignUpOption} />
        )}
      </View>
    </View>
  );
}
