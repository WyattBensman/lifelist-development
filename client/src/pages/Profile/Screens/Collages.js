import React, { useState } from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

// Utility to handle mixed ID formats
const getCollageId = (collage) => collage.id || collage._id;

export default function Collages({ data: collages, fetchMore }) {
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredCollages = collages;

  const renderCollageItem = ({ item, index }) => (
    <CollageCard
      collageId={getCollageId(item)}
      path={item.coverImage}
      index={index}
      collages={filteredCollages}
      cacheKeyPrefix="collage_cover_"
    />
  );

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchMore(); // Fetch more data via parent function
    } catch (error) {
      console.error("Error fetching more collages:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={filteredCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => getCollageId(item)}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger when 50% of the remaining list is visible
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#6AB952" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
