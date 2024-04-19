import { Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import UserPrivacyGroupCard from "../Cards/UserPrivacyGroupCard";
import { useState } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function PrivacyGroup() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Cool Guys"}
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
      <View style={layoutStyles.marginTopXs}>
        <UserPrivacyGroupCard isEditMode={isEditMode} />
      </View>
    </View>
  );
}
