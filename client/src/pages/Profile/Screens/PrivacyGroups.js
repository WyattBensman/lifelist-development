import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import PrivacyGroupCard from "../Cards/PrivacyGroupCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_PRIVACY_GROUPS } from "../../../utils/queries/privacyGroupQueries";
import { useQuery } from "@apollo/client";
import Icon from "../../../components/Icons/Icon";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function PrivacyGroups() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_PRIVACY_GROUPS);

  const renderPrivacyGroupCard = ({ item }) => (
    <PrivacyGroupCard
      isEditMode={isEditMode}
      privacyGroup={item}
      onDelete={(id) => {
        // handle delete logic here
        console.log("Delete privacy group with id:", id);
      }}
    />
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Privacy Groups"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          !isEditMode ? (
            <Icon
              name="square.and.pencil"
              style={iconStyles.squarePencilSm}
              onPress={() => setIsEditMode(true)}
            />
          ) : (
            <Pressable onPress={() => setIsEditMode(false)}>
              <Text style={{ color: "#fff", fontWeight: "500" }}>Exit</Text>
            </Pressable>
          )
        }
      />
      <View style={layoutStyles.contentContainer}>
        <ButtonSolid
          text={"Create New Group"}
          textColor="#fff"
          backgroundColor={"#252525"}
        />
        <FlatList
          data={data?.getAllPrivacyGroups}
          renderItem={renderPrivacyGroupCard}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </View>
  );
}
