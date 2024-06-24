// /components/Cards/InviteUserCard.js

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function InviteUserCard({ contact, isRegistered }) {
  const { name, phoneNumbers } = contact;
  const phoneNumber = phoneNumbers ? phoneNumbers[0].number : "";

  const handleInvite = () => {
    // Implement the invite functionality here
    alert(`Invite sent to ${name} (${phoneNumber})`);
  };

  const handleFollow = () => {
    // Implement the follow functionality here
    alert(`Follow request sent to ${name}`);
  };

  return (
    <View style={[styles.cardContainer, isRegistered && styles.registered]}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>
      {isRegistered ? (
        <Pressable style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.followText}>Follow</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.inviteButton} onPress={handleInvite}>
          <Text style={styles.inviteText}>Invite</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 4,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    color: "#fff",
  },
  phoneNumber: {
    color: "#696969",
  },
  inviteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#6AB95230",
  },
  inviteText: {
    color: "#6AB952",
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#6AB952",
  },
  followText: {
    color: "#fff",
  },
  registered: {
    opacity: 0.5,
  },
});
