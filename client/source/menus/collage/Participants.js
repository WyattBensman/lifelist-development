import React, { useCallback } from "react";
import { Text, View, FlatList, Dimensions } from "react-native";
import { useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_TAGGED_USERS } from "../../../utils/queries"; // Ensure the correct import path
import BottomPopup from "./BottomPopup";
import ParticipantCard from "../Cards/ParticipantCard";
import { menuStyles } from "../../../styles";

export default function Participants({ visible, onRequestClose, collageId }) {
  const { data, loading, error, refetch } = useQuery(GET_TAGGED_USERS, {
    variables: { collageId },
    skip: !visible, // Skip the query if the popup is not visible
  });

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        refetch();
      }
    }, [visible, refetch])
  );

  return (
    <BottomPopup
      visible={visible}
      onRequestClose={onRequestClose}
      initialHeight={Dimensions.get("window").height * 0.6}
      draggableHeader={
        <Text style={menuStyles.draggableHeader}>Participants</Text>
      }
    >
      <View style={menuStyles.nonDraggableContent}>
        <View style={menuStyles.dynamicPopupContainer}>
          <FlatList
            data={data?.getTaggedUsers || []}
            renderItem={({ item }) =>
              item ? (
                <View style={menuStyles.dynamicCardContainer}>
                  <ParticipantCard
                    participant={item}
                    onRequestClose={onRequestClose}
                  />
                </View>
              ) : null
            }
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text>No participants found.</Text>}
          />
        </View>
      </View>
    </BottomPopup>
  );
}
