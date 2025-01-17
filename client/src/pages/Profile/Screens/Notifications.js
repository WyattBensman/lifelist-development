import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { GET_USER_NOTIFICATIONS } from "../../../utils/queries";
import { DELETE_NOTIFICATION } from "../../../utils/mutations/index";

export default function Notifications() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_USER_NOTIFICATIONS);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);
  const [notifications, setNotifications] = useState([]);

  // Hide tab bar while viewing notifications
  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);
      return () => setIsTabBarVisible(true);
    }, [setIsTabBarVisible])
  );

  // Refetch data on focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Populate notifications on data change
  useEffect(() => {
    if (data?.getUserNotifications) {
      const sortedNotifications = data.getUserNotifications
        .filter((notification) => notification.sender !== null)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    }
  }, [data]);

  // Filter notifications based on search query
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

  if (loading) {
    return (
      <View style={layoutStyles.wrapper}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={layoutStyles.wrapper}>
        <Text style={{ color: "#ff0000" }}>Error: {error.message}</Text>
      </View>
    );
  }

  // Handle delete notification
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

  // Render a single notification
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
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title="Notifications"
        hasBorder={false}
      />
      <View
        style={[layoutStyles.marginSm, { alignSelf: "center", marginTop: 6 }]}
      >
        <SearchBarStandard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => {}}
          onFocusChange={() => {}}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        <FriendRequestCount />
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </View>
  );
}
