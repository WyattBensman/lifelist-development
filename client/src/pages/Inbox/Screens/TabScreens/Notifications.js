import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { layoutStyles } from "../../../../styles";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";
import { GET_USER_NOTIFICATIONS } from "../../../../utils/queries";

export default function Notifications() {
  const { data, loading, error } = useQuery(GET_USER_NOTIFICATIONS);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const notifications = data.getUserNotifications
    .filter((notification) => notification.sender !== null)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderItem = ({ item }) => (
    <NotificationCard
      senderName={item.sender.fullName}
      senderProfilePicture={item.sender.profilePicture}
      message={item.message}
      createdAt={item.createdAt}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FriendRequestCount />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}
