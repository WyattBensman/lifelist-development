import { FlatList, StyleSheet, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_REPOSTED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

export default function Reposts({ userId }) {
  const { data, loading, error } = useQuery(GET_REPOSTED_COLLAGES, {
    variables: { userId },
  });

  const filteredCollages = data?.getRepostedCollages.filter(
    (item) => !item.archived
  );

  const renderCollageItem = ({ item }) => (
    <CollageCard collageId={item._id} path={item.coverImage} />
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
