import { Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SolidButton from "../../../components/SolidButton";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import PrivacyGroupCard from "../Cards/PrivacyGroupCard";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function PrivacyGroups() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Privacy Groups"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          !isEditMode ? (
            <ToggleEditPrivacyGroupIcon onPress={() => setIsEditMode(true)} />
          ) : (
            <Pressable onPress={() => setIsEditMode(false)}>
              <Text>Exit</Text>
            </Pressable>
          )
        }
      />
      <View style={layoutStyles.contentContainer}>
        <View style={layoutStyles.marginBtmXs}>
          <SolidButton text={"Create New Group"} backgroundColor={"#ececec"} />
        </View>
        <PrivacyGroupCard isEditMode={isEditMode} />
        <PrivacyGroupCard isEditMode={isEditMode} />
        <PrivacyGroupCard isEditMode={isEditMode} />
      </View>
    </View>
  );
}
