import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_TAGGED_USERS } from "../../../utils/queries"; // Ensure correct import path
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import ParticipantCard from "../Cards/ParticipantCard";

export default function Participants({ visible, onRequestClose, collageId }) {
  const { data, loading, error } = useQuery(GET_TAGGED_USERS, {
    variables: { collageId },
    skip: !visible, // Skip the query if the popup is not visible
  });

  // Calculate the height based on the number of participants
  const numberOfParticipants = data?.getTaggedUsers?.length || 0;
  const dynamicHeight = 115 + numberOfParticipants * 60; // Adjust 60 based on the height of each participant card

  return (
    <BottomPopup
      visible={visible}
      onRequestClose={onRequestClose}
      height={dynamicHeight}
    >
      <View style={styles.container}>
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Participants</Text>
          <View style={styles.separator} />
          <FlatList
            data={data?.getTaggedUsers || []}
            renderItem={({ item }) =>
              item ? (
                <View style={[styles.cardContainer, layoutStyles.flex]}>
                  <ParticipantCard participant={item} />
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
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  popupContainer: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    paddingBottom: 12,
  },
  separator: {
    height: 2,
    backgroundColor: "#252525",
    marginBottom: 8,
  },
});
