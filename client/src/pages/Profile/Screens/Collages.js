import { FlatList, View, StyleSheet, Text } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

export default function Collages({ data: collages }) {
  const filteredCollages = collages || [];

  const renderCollageItem = ({ item, index }) => (
    <CollageCard
      collageId={item._id}
      path={item.coverImage}
      index={index}
      collages={filteredCollages}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={filteredCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => item._id}
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
