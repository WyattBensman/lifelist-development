import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_SAVED_COLLAGES } from "../../../utils/queries/userQueries";
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

export default function Saved() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [savedCollages, setSavedCollages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial data from cache on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Attempting to load cached saved collages data...");
      const cachedData = await getMetaDataFromCache("savedCollages");
      if (cachedData) {
        console.log("Cached saved collages data found, loading...");
        setSavedCollages(cachedData.collages);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      } else {
        console.log("No cached data found for saved collages.");
      }
    };
    loadCachedData();
  }, []);

  const { data, loading, error, fetchMore } = useQuery(GET_SAVED_COLLAGES, {
    variables: { cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      console.log("Data fetched from network for saved collages:", fetchedData);

      const { collages, nextCursor, hasNextPage } =
        fetchedData.getSavedCollages;

      // Save collages metadata to cache
      console.log("Saving collages metadata to cache...");
      await saveMetaDataToCache("savedCollages", {
        collages,
        nextCursor,
        hasNextPage,
      });

      // Attempt to cache each collage image if not already cached
      for (const collage of collages) {
        const imageKey = `saved_collage_${collage._id}`;
        console.log(`Attempting to load cached image for key: ${imageKey}`);

        const cachedImageUri = await getImageFromCache(imageKey);
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
          !savedCollages.some((saved) => saved._id === newCollage._id)
      );

      // Update state with new data
      setSavedCollages((prevCollages) => [
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
      console.log("Loading more saved collages...");
      await fetchMore({
        variables: { cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log("Fetched additional collages from network.");

          return {
            getSavedCollages: {
              ...fetchMoreResult.getSavedCollages,
              collages: [
                ...prev.getSavedCollages.collages,
                ...fetchMoreResult.getSavedCollages.collages,
              ],
            },
          };
        },
      });
    }
  };

  if (error) {
    console.log("Error loading saved collages:", error.message);
    return <Text>Error loading saved collages: {error.message}</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Saved"}
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
        data={savedCollages}
        renderItem={({ item, index }) => (
          <View style={{ height: screenHeight }}>
            <CollageCard
              collageId={item._id}
              path={item.coverImage}
              index={index}
              collages={savedCollages}
              cacheKeyPrefix="saved_collage_"
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
