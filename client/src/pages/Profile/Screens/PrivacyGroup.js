import { FlatList, Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import UserPrivacyGroupCard from "../Cards/UserPrivacyGroupCard";
import { useState } from "react";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_PRIVACY_GROUP } from "../../../utils/queries/privacyGroupQueries";

export default function PrivacyGroup() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const privacyGroupId = "663a7431dbf476dbd43fc7be";
  const { data, loading, error } = useQuery(GET_PRIVACY_GROUP, {
    variables: { privacyGroupId },
  });

  console.log(data);

  const renderUserPrivacyGroupCard = ({ item }) => (
    <UserPrivacyGroupCard
      isEditMode={isEditMode}
      fullName={item.fullName}
      username={item.username}
      profilePicture={item.profilePicture}
    />
  );

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
      <FlatList
        data={data.getPrivacyGroup.users}
        renderItem={renderUserPrivacyGroupCard}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}
