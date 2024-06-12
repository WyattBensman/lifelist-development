import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import { layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";
import IconHeader from "../../../icons/IconHeader";
import Collage from "../../Collage/Screens/Collage";
import { useQuery } from "@apollo/client";
import { GET_MAIN_FEED } from "../../../utils/queries";

const { height } = Dimensions.get("window");

export default function MainFeed() {
  const { currentUser } = useAuth();
  const [collages, setCollages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log(currentUser._id);
  console.log(currentUser);

  const { loading, error, data, fetchMore } = useQuery(GET_MAIN_FEED, {
    variables: { userId: currentUser._id, page: 1 },
    skip: !currentUser, // Skip query if currentUser is not available
    fetchPolicy: "cache-and-network",
  });

  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Data:", data);

  useEffect(() => {
    if (data) {
      setCollages(data.getMainFeed.collages);
      setHasMore(data.getMainFeed.hasMore);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMore({
        variables: {
          userId: currentUser.id,
          page: page + 1,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          setPage(page + 1);
          setHasMore(fetchMoreResult.getMainFeed.hasMore);
          return {
            getMainFeed: {
              __typename: previousResult.getMainFeed.__typename,
              collages: [
                ...previousResult.getMainFeed.collages,
                ...fetchMoreResult.getMainFeed.collages,
              ],
              hasMore: fetchMoreResult.getMainFeed.hasMore,
            },
          };
        },
      });
    }
  };

  const renderCollage = useCallback(
    ({ item }) => <Collage collageId={item._id} />,
    []
  );

  if (!currentUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (loading && page === 1)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<IconHeader name="plus.square.on.square" />}
        icon2={<IconHeader name="bell" />}
      />
      <FlatList
        data={collages}
        renderItem={renderCollage}
        keyExtractor={(item) => item._id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={height}
        decelerationRate="fast"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    height: height * 1.1, // Adjust this value if necessary to ensure snapping works correctly
  },
});
