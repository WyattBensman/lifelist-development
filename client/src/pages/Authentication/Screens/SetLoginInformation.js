import { Image, StyleSheet, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SetLoginInformationForm from "../Forms/SetLoginInformationForm";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function SetLoginInformation() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<NextPageArrowIcon color={"#d4d4d4"} />}
      />
      <View style={authenticationStyles.formContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={authenticationStyles.iconSmall}
          resizeMode="contain"
        />
        <Text style={authenticationStyles.header}>Set Login Information</Text>
        <Text style={authenticationStyles.subheader}>Step 1 of 2</Text>
        <SetLoginInformationForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 16,
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
