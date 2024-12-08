import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, View, Text } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_TAGGED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  getImageFromFileSystem,
} from "../../../utils/newCacheHelper";

const { height: screenHeight } = Dimensions.get("window");
const PAGE_SIZE = 16;

export default function Tagged() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [taggedCollages, setTaggedCollages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await getMetadataFromCache("taggedCollages");
      if (cachedData) {
        setTaggedCollages(cachedData.collages);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      }
    };
    loadCachedData();
  }, []);

  const { data, loading, error, fetchMore } = useQuery(GET_TAGGED_COLLAGES, {
    variables: { cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      const { collages, nextCursor, hasNextPage } =
        fetchedData.getTaggedCollages;

      await saveMetadataToCache("taggedCollages", {
        collages,
        nextCursor,
        hasNextPage,
      });

      for (const collage of collages) {
        const imageKey = `tagged_collage_${collage._id}`;
        if (!(await getImageFromFileSystem(imageKey))) {
          await saveImageToFileSystem(imageKey, collage.coverImage);
        }
      }

      const newUniqueCollages = collages.filter(
        (newCollage) =>
          !taggedCollages.some((tagged) => tagged._id === newCollage._id)
      );

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
      await fetchMore({
        variables: { cursor, limit: PAGE_SIZE },
      });
    }
  };

  if (error) return <Text>Error loading tagged collages: {error.message}</Text>;

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
      />
    </View>
  );
}
