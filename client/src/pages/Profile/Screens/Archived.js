import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, View, Text } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_ARCHIVED_COLLAGES } from "../../../utils/queries/userQueries";
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

export default function Archived() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [archivedCollages, setArchivedCollages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial data from cache on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Attempting to load cached archived collages data...");
      const cachedData = await getMetaDataFromCache("archivedCollages");
      if (cachedData) {
        console.log("Cached archived collages data found, loading...");
        setArchivedCollages(cachedData.collages);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      } else {
        console.log("No cached data found for archived collages.");
      }
    };
    loadCachedData();
  }, []);

  const { data, loading, error, fetchMore } = useQuery(GET_ARCHIVED_COLLAGES, {
    variables: { cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      console.log(
        "Data fetched from network for archived collages:",
        fetchedData
      );

      const { collages, nextCursor, hasNextPage } =
        fetchedData.getArchivedCollages;

      // Save collages metadata to cache
      console.log("Saving collages metadata to cache...");
      await saveMetaDataToCache("archivedCollages", {
        collages,
        nextCursor,
        hasNextPage,
      });

      // Attempt to cache each collage image if not already cached
      for (const collage of collages) {
        const imageKey = `archived_collage_${collage._id}`;
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
          !archivedCollages.some((archived) => archived._id === newCollage._id)
      );

      // Update state with new data
      setArchivedCollages((prevCollages) => [
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
      console.log("Loading more archived collages...");
      await fetchMore({
        variables: { cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log("Fetched additional collages from network.");

          return {
            getArchivedCollages: {
              ...fetchMoreResult.getArchivedCollages,
              collages: [
                ...prev.getArchivedCollages.collages,
                ...fetchMoreResult.getArchivedCollages.collages,
              ],
            },
          };
        },
      });
    }
  };

  if (error) {
    console.log("Error loading archived collages:", error.message);
    return <Text>Error loading archived collages: {error.message}</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Archived"}
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
        data={archivedCollages}
        renderItem={({ item, index }) => (
          <View style={{ height: screenHeight }}>
            <CollageCard
              collageId={item._id}
              path={item.coverImage}
              index={index}
              collages={archivedCollages}
              cacheKeyPrefix="archived_collage_"
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
      />
    </View>
  );
}
