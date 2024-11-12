import { FlatList, View, StyleSheet, Text } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

export default function Reposts({ data: collages, loadMore }) {
  const filteredCollages = collages || [];

  const renderCollageItem = ({ item, index }) => (
    <CollageCard
      collageId={item.id || item._id}
      path={item.coverImage}
      index={index}
      collages={filteredCollages}
      cacheKeyPrefix="collage_cover_"
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={filteredCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => item.id || item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={loadMore} // Trigger loadMore when near the end
        onEndReachedThreshold={0.5} // Adjust threshold for triggering loadMore
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reposts found.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
