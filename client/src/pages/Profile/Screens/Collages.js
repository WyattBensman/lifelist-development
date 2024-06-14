import { FlatList, View, StyleSheet, Text } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

export default function Collages({ userId }) {
  const { data, loading, error } = useQuery(GET_USER_COLLAGES, {
    variables: { userId },
  });

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );

  const filteredCollages = data?.getUserCollages.filter(
    (item) => !item.archived
  );

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
        keyExtractor={(item) => item._id.toString()}
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
