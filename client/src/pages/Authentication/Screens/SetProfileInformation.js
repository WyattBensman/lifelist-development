import { Image, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SetProfileInformationForm from "../Forms/SetProfileInformationForm";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function SetProfileInformation() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack arrow={<BackArrowIcon navigation={navigation} />} />
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
