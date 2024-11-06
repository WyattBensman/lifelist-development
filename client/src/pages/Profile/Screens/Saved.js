import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, View, ActivityIndicator } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_SAVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";

const { height: screenHeight } = Dimensions.get("window");
const PAGE_SIZE = 20;

export default function Saved() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [savedCollages, setSavedCollages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, fetchMore } = useQuery(GET_SAVED_COLLAGES, {
    variables: { cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
  });

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useEffect(() => {
    if (data) {
      const { collages, nextCursor, hasNextPage } = data.getSavedCollages;
      setSavedCollages((prevCollages) => [...prevCollages, ...collages]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    }
  }, [data]);

  const loadMore = async () => {
    if (hasMore && !loading) {
      await fetchMore({
        variables: { cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

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

  if (error) return <Text>Error loading saved collages: {error.message}</Text>;

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
