import { Image, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SetProfileInformationForm from "../Forms/SetProfileInformationForm";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

export default function SetProfileInformation() {
  const navigation = useNavigation();
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
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<NextPageArrowIcon color={"#d4d4d4"} />}
      />
      <View style={authenticationStyles.formContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={authenticationStyles.iconSmall}
          resizeMode="contain"
        />
        <Text style={authenticationStyles.header}>Set Profile Information</Text>
        <Text style={authenticationStyles.subheader}>Step 2 of 2</Text>
        <SetProfileInformationForm />
      </View>
    </View>
  );
}
