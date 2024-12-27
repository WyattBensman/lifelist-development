import React, { useCallback } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import { useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_TAGGED_USERS } from "../../../utils/queries"; // Ensure correct import path
import { headerStyles, layoutStyles } from "../../../styles";
import BottomPopup from "./BottomPopup";
import ParticipantCard from "../Cards/ParticipantCard";

const { height: screenHeight } = Dimensions.get("window");

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
      initialHeight={screenHeight * 0.6}
      draggableHeader={<Text style={styles.draggableHeader}>Participants</Text>}
    >
      <View style={styles.nonDraggableContent}>
        <View style={styles.dynamicPopupContainer}>
          <FlatList
            data={data?.getTaggedUsers || []}
            renderItem={({ item }) =>
              item ? (
                <View style={[styles.cardContainer, layoutStyles.flex]}>
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

const styles = StyleSheet.create({
  nonDraggableContent: {
    flex: 1,
  },
  dynamicPopupContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  cardContainer: {
    paddingBottom: 8,
  },
  draggableHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
});
