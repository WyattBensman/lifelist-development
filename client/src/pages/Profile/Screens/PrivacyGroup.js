import { Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import UserCard from "../Cards/UserCard";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import UserPrivacyGroupCard from "../Cards/UserPrivacyGroupCard";
import { useState } from "react";

export default function PrivacyGroup() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <View style={layoutStyles.container}>
      <StackHeader
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
      <View style={layoutStyles.marginTopSm}>
        <UserPrivacyGroupCard isEditMode={isEditMode} />
      </View>
    </View>
  );
}
