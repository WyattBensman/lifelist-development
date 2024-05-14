import { Image, Pressable, Text, View } from "react-native";
import { layoutStyles, authenticationStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import SetLoginInformationForm from "../Forms/SetLoginInformationForm";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useState } from "react";
import LeaveProfileSetupModal from "../Popups/LeaveProfileSetupModal";
import BackArrowIcon from "../Icons/BackArrowIcon";

export default function SetLoginInformation() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    setModalVisible(true); // Show modal when trying to go back
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Pressable onPress={handleGoBack}>
            <BackArrowIcon />
          </Pressable>
        }
        button1={
          <NextPageArrowIcon
            color={"#d4d4d4"}
            navigateTo={"SetProfileInformation"}
            navigation={navigation}
          />
        }
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
        <LeaveProfileSetupModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigation={navigation}
        />
      </View>
    </View>
  );
}
