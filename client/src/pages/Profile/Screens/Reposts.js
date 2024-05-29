import { FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_REPOSTED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

export default function Reposts({ userId }) {
  const { data, loading, error } = useQuery(GET_REPOSTED_COLLAGES, {
    variables: { userId },
  });

  const renderCollageItem = ({ item }) => (
    <CollageCard path={item.coverImage} />
  );

  return (
    <View>
      <FlatList
        data={data?.getRepostedCollages}
        renderItem={renderCollageItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={3}
      />
    </View>
  );
}
