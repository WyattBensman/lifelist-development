import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_TAGGED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
  getImageFromCache,
  saveImageToCache,
} from "../../../utils/cacheHelper";

const { height: screenHeight } = Dimensions.get("window");
const PAGE_SIZE = 20;

export default function Tagged() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [taggedCollages, setTaggedCollages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial data from cache on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Attempting to load cached tagged collages data...");
      const cachedData = await getMetaDataFromCache("taggedCollages");
      if (cachedData) {
        console.log("Cached tagged collages data found, loading...");
        setTaggedCollages(cachedData.collages);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      } else {
        console.log("No cached data found for tagged collages.");
      }
    };
    loadCachedData();
  }, []);

  const { data, loading, error, fetchMore } = useQuery(GET_TAGGED_COLLAGES, {
    variables: { cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      console.log(
        "Data fetched from network for tagged collages:",
        fetchedData
      );

      const { collages, nextCursor, hasNextPage } =
        fetchedData.getTaggedCollages;

      // Save collages metadata to cache
      console.log("Saving collages metadata to cache...");
      await saveMetaDataToCache("taggedCollages", {
        collages,
        nextCursor,
        hasNextPage,
      });

      // Attempt to cache each collage image if not already cached
      for (const collage of collages) {
        const imageKey = `tagged_collage_${collage._id}`;
        console.log(`Attempting to load cached image for key: ${imageKey}`);

        const cachedImageUri = await getImageFromCache(
          imageKey,
          collage.coverImage
        );
        if (!cachedImageUri) {
          console.log(
            `Image not found in cache, downloading and caching: ${imageKey}`
          );
          await saveImageToCache(imageKey, collage.coverImage);
        } else {
          console.log(`Image already cached for key: ${imageKey}`);
        }
      }

      // Remove any duplicates by checking against current state
      const newUniqueCollages = collages.filter(
        (newCollage) =>
          !taggedCollages.some((tagged) => tagged._id === newCollage._id)
      );

      // Update state with new data
      setTaggedCollages((prevCollages) => [
        ...prevCollages,
        ...newUniqueCollages,
      ]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    },
  });

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const loadMore = async () => {
    if (hasMore && !loading) {
      console.log("Loading more tagged collages...");
      await fetchMore({
        variables: { cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log("Fetched additional collages from network.");

          return {
            getTaggedCollages: {
              ...fetchMoreResult.getTaggedCollages,
              collages: [
                ...prev.getTaggedCollages.collages,
                ...fetchMoreResult.getTaggedCollages.collages,
              ],
            },
          };
        },
      });
    }
  };

  if (error) {
    console.log("Error loading tagged collages:", error.message);
    return <Text>Error loading tagged collages: {error.message}</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Tagged"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
      />
      <FlatList
        data={taggedCollages}
        renderItem={({ item, index }) => (
          <View style={{ height: screenHeight }}>
            <CollageCard
              collageId={item._id}
              path={item.coverImage}
              index={index}
              collages={taggedCollages}
              cacheKeyPrefix="tagged_collage_"
            />
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={screenHeight}
        decelerationRate="fast"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" />}
      />
    </View>
  );
}
