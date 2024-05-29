import { FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

export default function Collages({ userId }) {
  const { data, loading, error } = useQuery(GET_USER_COLLAGES, {
    variables: { userId },
  });

  const renderCollageItem = ({ item }) => (
    <CollageCard path={item.coverImage} />
  );

  return (
    <View>
      <FlatList
        data={data?.getUserCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={3}
      />
    </View>
  );
}
