import React, { useState, useCallback } from "react";
import { FlatList, Pressable, Text, View, Alert } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PrivacyGroupCard from "../Cards/PrivacyGroupCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_ALL_PRIVACY_GROUPS } from "../../../utils/queries/privacyGroupQueries";
import { useQuery, useMutation } from "@apollo/client";
import Icon from "../../../components/Icons/Icon";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { DELETE_PRIVACY_GROUP } from "../../../utils/mutations/index";

export default function PrivacyGroups() {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRIVACY_GROUPS);
  const [deletePrivacyGroup] = useMutation(DELETE_PRIVACY_GROUP);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDelete = async (id) => {
    try {
      const { data } = await deletePrivacyGroup({
        variables: { privacyGroupId: id },
      });

      if (data.deletePrivacyGroup.success) {
        refetch();
      } else {
        Alert.alert("Error", data.deletePrivacyGroup.message);
      }
    } catch (error) {
      console.error("Error deleting privacy group:", error);
    }
  };

  const renderPrivacyGroupCard = ({ item }) => (
    <PrivacyGroupCard
      isEditMode={isEditMode}
      privacyGroup={item}
      onDelete={handleDelete}
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
          onPress={() => navigation.navigate("CreatePrivacyGroup")}
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
