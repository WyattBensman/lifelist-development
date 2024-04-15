import { Pressable, Text, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import SolidButton from "../../../components/SolidButton";
import { layoutStyles } from "../../../styles";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import PrivacyGroupCard from "../Cards/PrivacyGroupCard";
import { useState } from "react";

export default function PrivacyGroups() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <View style={layoutStyles.container}>
      <StackHeader
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
      <View style={[layoutStyles.contentContainer, layoutStyles.marginTopLg]}>
        <SolidButton text={"Create New Group"} backgroundColor={"#ececec"} />
        <PrivacyGroupCard isEditMode={isEditMode} />
      </View>
    </View>
  );
}
