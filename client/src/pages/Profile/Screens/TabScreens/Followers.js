import React, { useCallback } from "react";
import { FlatList, Alert, Text, View } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
} from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";
import { useFocusEffect } from "@react-navigation/native";

export default function Followers({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const {
    data: followersData,
    loading: loadingFollowers,
    error: errorFollowers,
    refetch: refetchFollowers,
  } = useQuery(GET_FOLLOWERS, {
    variables: { userId },
  });
  const {
    data: followingData,
    loading: loadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId: currentUser },
  });

  useFocusEffect(
    useCallback(() => {
      refetchFollowers();
      refetchFollowing();
    }, [refetchFollowers, refetchFollowing])
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

  const filteredFollowers = followersData?.getFollowers.filter((follower) =>
    follower.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowerItem = ({ item }) => {
    let action = "Follow";
    if (
      followingData?.getFollowing.some(
        (following) => following._id === item._id
      )
    ) {
      action = "Following";
    } else if (item.followRequests.some((req) => req._id === currentUser)) {
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

  if (loadingFollowers || loadingFollowing) return <Text>Loading...</Text>;
  if (errorFollowers || errorFollowing)
    return (
      <Text>Error: {errorFollowers?.message || errorFollowing?.message}</Text>
    );

  return (
    <FlatList
      data={filteredFollowers}
      renderItem={renderFollowerItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
    />
  );
}
