import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SetLoginInformationForm from "../Forms/SetLoginInformationForm";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

export default function SetLoginInformation() {
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
    <View style={layoutStyles.container}>
      <StackHeader
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<NextPageArrowIcon color={"#d4d4d4"} />}
      />
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../../public/branding/lifelist-logo.png")}
          style={{ width: 40, height: 40, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Text style={styles.header}>Set Login Information</Text>
        <Text style={styles.subheader}>Step 1 of 2</Text>
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
