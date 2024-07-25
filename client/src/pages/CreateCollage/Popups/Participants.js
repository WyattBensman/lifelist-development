import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import ParticipantCard from "../../Collage/Cards/ParticipantCard";

export default function Participants({ visible, onRequestClose, taggedUsers }) {
  // Calculate the height based on the number of participants
  const numberOfParticipants = taggedUsers.length || 0;
  const dynamicHeight = 115 + numberOfParticipants * 60; // Adjust 60 based on the height of each participant card

  return (
    <BottomPopup
      visible={visible}
      onRequestClose={onRequestClose}
      height={dynamicHeight}
    >
      <View style={styles.container}>
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Tagged Users</Text>
          <View style={styles.separator} />
          <FlatList
            data={taggedUsers}
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
