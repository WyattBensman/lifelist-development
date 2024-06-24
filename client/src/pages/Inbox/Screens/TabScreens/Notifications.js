import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { layoutStyles } from "../../../../styles";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";
import { GET_USER_NOTIFICATIONS } from "../../../../utils/queries";

export default function Notifications() {
  const { data, loading, error } = useQuery(GET_USER_NOTIFICATIONS);
  console.log(data);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }) => {
    if (!item.sender) {
      return null; // Skip rendering this notification if the sender is null
    }

    return (
      <NotificationCard
        senderName={item.sender.fullName}
        senderProfilePicture={item.sender.profilePicture}
        message={item.message}
        createdAt={item.createdAt}
      />
    );
  };

  return (
    <View style={layoutStyles.wrapper}>
      <FriendRequestCount />
      <FlatList
        data={data.getUserNotifications.filter(
          (notification) => notification.sender !== null
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}
