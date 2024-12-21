import React, { useEffect, useState } from "react";
import { FlatList, Alert, Text, ActivityIndicator } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useQuery } from "@apollo/client";
import { GET_FOLLOWING } from "../../../../utils/queries/userQueries";
import {
  getMetadataFromCache,
  saveMetadataToCache,
  getImageFromFileSystem,
  saveImageToFileSystem,
} from "../../../../utils/newCacheHelper";
import { useProfile } from "../../../../contexts/ProfileContext";

const PAGE_SIZE = 20;

export default function Following({ userId, searchQuery }) {
  const [followingList, setFollowingList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCache, setLoadingCache] = useState(true);

  const { followUser, unfollowUser, sendFollowRequest, unsendFollowRequest } =
    useProfile();

  // Load cached metadata on mount
  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await getMetadataFromCache(`following_${userId}`);
      if (cachedData) {
        setFollowingList(cachedData.users);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      }
      setLoadingCache(false);
    };
    loadCachedData();
  }, [userId]);

  const { data, loading, error, fetchMore } = useQuery(GET_FOLLOWING, {
    variables: { userId, cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      const { users, nextCursor, hasNextPage } = fetchedData.getFollowing;

      // Save metadata to cache
      await saveMetadataToCache(`following_${userId}`, {
        users,
        nextCursor,
        hasNextPage,
      });

      // Cache profile pictures
      for (const { user } of users) {
        const imageKey = `profile_picture_${user._id}`;
        const cachedImageUri = await getImageFromFileSystem(imageKey);

        if (!cachedImageUri) {
          console.log(`Caching profile picture for user: ${user._id}`);
          await saveImageToFileSystem(imageKey, user.profilePicture);
        } else {
          console.log(`Profile picture already cached for user: ${user._id}`);
        }
      }

      // Remove duplicates and update state
      const newUniqueFollowing = users.filter(
        (newUser) =>
          !followingList.some(
            (existing) => existing.user._id === newUser.user._id
          )
      );
      setFollowingList((prev) => [...prev, ...newUniqueFollowing]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    },
  });

  const handleActionPress = async (targetUserId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          await sendFollowRequest(targetUserId);
          Alert.alert("Request Sent", "Follow request has been sent.");
          return "Requested";
        } else {
          await followUser(targetUserId);
          Alert.alert("Follow", "You are now following this user.");
          return "Following";
        }
      } else if (action === "Following") {
        await unfollowUser(targetUserId);
        Alert.alert("Unfollow", "You have unfollowed this user.");
        return "Follow";
      } else if (action === "Requested") {
        await unsendFollowRequest(targetUserId);
        Alert.alert("Request Withdrawn", "Follow request has been withdrawn.");
        return "Follow";
      }
    } catch (error) {
      Alert.alert("Action Error", error.message);
      return action; // Return the current action if there's an error
    }
  };

  const loadMore = async () => {
    if (hasMore && !loading) {
      await fetchMore({
        variables: { userId, cursor, limit: PAGE_SIZE },
      });
    }
  };

  const filteredFollowing = followingList.filter((following) =>
    following.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowingItem = ({ item }) => (
    <UserRelationsCard
      user={item.user}
      initialAction={item.relationshipStatus}
      onActionPress={handleActionPress}
      isPrivate={item.isPrivate}
    />
  );

  if (loadingCache || (loading && !followingList.length)) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    console.error("Error loading following:", error.message);
    return <Text>Error loading following: {error.message}</Text>;
  }

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item.user._id.toString()}
      style={layoutStyles.wrapper}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
