import { FlatList, View, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

export default function Collages({ userId }) {
  const { data, loading, error } = useQuery(GET_USER_COLLAGES, {
    variables: { userId },
  });

  const renderCollageItem = ({ item }) => (
    <CollageCard path={item.coverImage} />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={data?.getUserCollages}
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
