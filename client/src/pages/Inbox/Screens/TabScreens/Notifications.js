import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { layoutStyles } from "../../../../styles";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";
import { GET_USER_NOTIFICATIONS } from "../../../../utils/queries";
import { DELETE_NOTIFICATION } from "../../../../utils/mutations/index";

export default function Notifications({ searchQuery }) {
  const { data, loading, error, refetch } = useQuery(GET_USER_NOTIFICATIONS);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);
  const [notifications, setNotifications] = useState([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (data?.getUserNotifications) {
      const sortedNotifications = data.getUserNotifications
        .filter((notification) => notification.sender !== null)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    }
  }, [data]);

  useEffect(() => {
    if (data?.getUserNotifications) {
      const filteredNotifications = data.getUserNotifications.filter(
        (notification) =>
          notification.sender &&
          notification.sender.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setNotifications(filteredNotifications);
    }
  }, [searchQuery, data]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification({ variables: { notificationId } });
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const renderItem = ({ item }) => (
    <NotificationCard
      notificationId={item._id}
      senderName={item.sender.fullName}
      senderProfilePicture={item.sender.profilePicture}
      message={item.message}
      createdAt={item.createdAt}
      onDelete={handleDelete}
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
