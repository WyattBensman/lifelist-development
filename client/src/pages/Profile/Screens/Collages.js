import { FlatList, View, StyleSheet, Text } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

const getCollageId = (collage) => collage.id || collage._id;

export default function Collages({ data: collages, loadMore, hasMore }) {
  const filteredCollages = collages || [];

  const renderCollageItem = ({ item, index }) => (
    <CollageCard
      collageId={getCollageId(item)}
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
        keyExtractor={(item) => getCollageId(item)}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={() => {
          if (hasMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
