import React, { useCallback } from "react";
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
  const { currentUser } = useAuth();

  const {
    data: followingData,
    loading: loadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId },
  });

  const {
    data: currentUserFollowingData,
    loading: loadingCurrentUserFollowing,
    error: errorCurrentUserFollowing,
    refetch: refetchCurrentUserFollowing,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId: currentUser },
  });

  useFocusEffect(
    useCallback(() => {
      refetchFollowing();
      refetchCurrentUserFollowing();
    }, [refetchFollowing, refetchCurrentUserFollowing])
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
      return action;
    }
  };

  const filteredFollowing = followingData?.getFollowing.filter((following) =>
    following.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowingItem = ({ item }) => {
    let action = "Follow";
    if (
      currentUserFollowingData?.getFollowing.some(
        (following) => following._id === item._id
      )
    ) {
      action = "Following";
    } else if (item.followRequests.some((req) => req.userId === currentUser)) {
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

  if (loadingFollowing || loadingCurrentUserFollowing)
    return <Text>Loading...</Text>;
  if (errorFollowing || errorCurrentUserFollowing)
    return (
      <Text>
        Error: {errorFollowing?.message || errorCurrentUserFollowing?.message}
      </Text>
    );

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
    />
  );
}
