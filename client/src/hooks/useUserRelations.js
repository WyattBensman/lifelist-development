import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
  getImageFromCache,
  saveImageToCache,
} from "../utils/newCacheHelper";

const PAGE_SIZE = 20;

export function useUserRelations(query, userId, cacheKey) {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCache, setLoadingCache] = useState(true);

  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: { userId, cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await getMetaDataFromCache(cacheKey);
      if (cachedData) {
        setUsers(cachedData.users);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      }
      setLoadingCache(false);
    };

    loadCachedData();
  }, [cacheKey]);

  useEffect(() => {
    if (data?.getRelations) {
      const {
        users: fetchedUsers,
        nextCursor,
        hasNextPage,
      } = data.getRelations;

      saveMetaDataToCache(cacheKey, {
        users: fetchedUsers,
        nextCursor,
        hasNextPage,
      });

      for (const { user } of fetchedUsers) {
        const imageKey = `profile_picture_${user._id}`;
        getImageFromCache(imageKey, user.profilePicture).then((cachedImage) => {
          if (!cachedImage) {
            saveImageToCache(imageKey, user.profilePicture);
          }
        });
      }

      const newUniqueUsers = fetchedUsers.filter(
        (user) => !users.some((u) => u._id === user._id)
      );

      setUsers((prev) => [...prev, ...newUniqueUsers]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    }
  }, [data]);

  const loadMore = async () => {
    if (hasMore && !loading) {
      await fetchMore({
        variables: { userId, cursor, limit: PAGE_SIZE },
      });
    }
  };

  return {
    users,
    loading: loadingCache || loading,
    error,
    loadMore,
    hasMore,
  };
}
