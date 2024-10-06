import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
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
      draggableHeader={
        <Text
          style={[
            headerStyles.headerMedium,
            { paddingHorizontal: 16, marginTop: 16 },
          ]}
        >
          Participants
        </Text>
      }
    >
      <View style={styles.container}>
        <View style={styles.popupContainer}>
          <View style={styles.separator} />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text>Error: {error.message}</Text>
          ) : (
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
          )}
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
    paddingTop: 0,
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
