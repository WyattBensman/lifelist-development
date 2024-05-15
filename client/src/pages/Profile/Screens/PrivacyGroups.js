import { FlatList, Pressable, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SolidButton from "../../../components/SolidButton";
import ToggleEditPrivacyGroupIcon from "../Icons/ToggleEditPrivacyGroupIcon";
import PrivacyGroupCard from "../Cards/PrivacyGroupCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_PRIVACY_GROUPS } from "../../../utils/queries/privacyGroupQueries";
import { useQuery } from "@apollo/client";

export default function PrivacyGroups() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_PRIVACY_GROUPS);

  const renderPrivacyGroupCard = ({ item }) => (
    <PrivacyGroupCard isEditMode={isEditMode} privacyGroup={item} />
  );

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
        {/* NEED TO CREATE THE CREATE PRIVACY GROUP PAGE */}
        <SolidButton text={"Create New Group"} backgroundColor={"#ececec"} />
        <FlatList
          data={data?.getAllPrivacyGroups}
          renderItem={renderPrivacyGroupCard}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </View>
  );
}
