import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Alert, Text } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import { GET_FOLLOWING } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";
import { useFocusEffect } from "@react-navigation/native";

export default function Following({ userId, searchQuery }) {
  const { currentUser, updateCurrentUser } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_FOLLOWING, {
    variables: { userId },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  const handleActionPress = async (userId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          const { data } = await sendFollowRequest({
            variables: { userIdToFollow: userId },
          });
          updateCurrentUser({
            pendingFriendRequests: [
              ...currentUser.pendingFriendRequests,
              userId,
            ],
          });
          Alert.alert("Request Sent", data.sendFollowRequest.message);
          return "Requested";
        } else {
          const { data } = await followUser({
            variables: { userIdToFollow: userId },
          });
          updateCurrentUser({
            following: [...currentUser.following, userId],
          });
          Alert.alert("Follow", data.followUser.message);
          return "Following";
        }
      } else if (action === "Following") {
        const { data } = await unfollowUser({
          variables: { userIdToUnfollow: userId },
        });
        updateCurrentUser({
          following: currentUser.following.filter((id) => id !== userId),
        });
        Alert.alert("Unfollow", data.unfollowUser.message);
        return "Follow";
      } else if (action === "Requested") {
        const { data } = await unsendFollowRequest({
          variables: { userIdToUnfollow: userId },
        });
        updateCurrentUser({
          pendingFriendRequests: currentUser.pendingFriendRequests.filter(
            (id) => id !== userId
          ),
        });
        Alert.alert("Request Withdrawn", data.unsendFollowRequest.message);
        return "Follow";
      }
    } catch (error) {
      Alert.alert("Action Error", error.message);
      return action; // Return the current action if there's an error
    }
  };

  const filteredFollowing = data?.getFollowing.filter((following) =>
    following.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowingItem = ({ item }) => {
    let action = "Follow";
    if (data?.getFollowing.some((following) => following._id === item._id)) {
      action = "Following";
    } else if (
      item.followRequests.some((req) => req.userId === currentUser._id)
    ) {
      action = "Requested";
    }

    return (
      <UserRelationsCard
        user={item}
        initialAction={action}
        onActionPress={handleActionPress}
      />
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
    />
  );
}
