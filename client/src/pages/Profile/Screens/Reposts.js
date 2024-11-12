import { FlatList, View, StyleSheet, Text } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

// Utility to handle mixed ID formats
const getCollageId = (collage) => collage.id || collage._id;

export default function Reposts({ data: collages }) {
  const filteredCollages = collages || [];

  const renderCollageItem = ({ item, index }) => (
    <CollageCard
      collageId={getCollageId(item)}
      path={item.coverImage}
      index={index}
      collages={filteredCollages}
      cacheKeyPrefix="repost_cover_"
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={filteredCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
