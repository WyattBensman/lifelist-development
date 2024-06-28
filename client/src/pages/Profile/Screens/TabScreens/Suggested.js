import React, { useState, useEffect } from "react";
import { FlatList, Alert, Text } from "react-native";
import * as Contacts from "expo-contacts";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS } from "../../../../utils/queries/index";
import { GET_FOLLOWING } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/index";
import { layoutStyles } from "../../../../styles";
import SuggestedUserCard from "../../Cards/SuggestedUserCard";
import { useAuth } from "../../../../contexts/AuthContext";

export default function Suggested({ searchQuery }) {
  const [contacts, setContacts] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { currentUser } = useAuth();

  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    variables: { limit: 100, offset: 0 },
  });

  const {
    loading: loadingFollowing,
    error: errorFollowing,
    data: followingData,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId: currentUser._id },
  });

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (!loading && !error && data && followingData) {
      const contactPhoneNumbers = contacts.flatMap((contact) =>
        contact.phoneNumbers ? contact.phoneNumbers.map((pn) => pn.number) : []
      );

      const contactEmails = contacts.flatMap((contact) =>
        contact.emails ? contact.emails.map((e) => e.email) : []
      );

      const followingIds = followingData.getFollowing.map((user) => user._id);

      const suggested = data.getAllUsers.filter(
        (user) =>
          (contactPhoneNumbers.includes(user.phoneNumber) ||
            contactEmails.includes(user.email)) &&
          !followingIds.includes(user._id)
      );

      setSuggestedFriends(suggested);
    }
  }, [contacts, loading, error, data, followingData]);

  const handleActionPress = async (userId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          const { data } = await sendFollowRequest({
            variables: { userIdToFollow: userId },
          });
          Alert.alert("Request Sent", data.sendFollowRequest.message);
          return "Requested";
        } else {
          const { data } = await followUser({
            variables: { userIdToFollow: userId },
          });
          Alert.alert("Follow", data.followUser.message);
          return "Following";
        }
      } else if (action === "Following") {
        const { data } = await unfollowUser({
          variables: { userIdToUnfollow: userId },
        });
        Alert.alert("Unfollow", data.unfollowUser.message);
        return "Follow";
      } else if (action === "Requested") {
        const { data } = await unsendFollowRequest({
          variables: { userIdToUnfollow: userId },
        });
        Alert.alert("Request Withdrawn", data.unsendFollowRequest.message);
        return "Follow";
      }
    } catch (error) {
      Alert.alert("Action Error", error.message);
      return action; // Return the current action if there's an error
    }
  };

  const filteredSuggestedFriends = suggestedFriends.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSuggestedFriendItem = ({ item }) => (
    <SuggestedUserCard
      user={item}
      initialAction="Follow"
      onActionPress={handleActionPress}
      isInContacts={true}
    />
  );

  if (loading || loadingFollowing) return <Text>Loading...</Text>;
  if (error || errorFollowing)
    return <Text>Error: {error?.message || errorFollowing?.message}</Text>;

  return (
    <FlatList
      data={filteredSuggestedFriends}
      renderItem={renderSuggestedFriendItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
    />
  );
}
