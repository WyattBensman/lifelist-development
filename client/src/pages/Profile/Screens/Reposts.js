import { FlatList, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_REPOSTED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

export default function Collages() {
  const { currentUser } = useAuth();

  const { data, loading, error } = useQuery(GET_REPOSTED_COLLAGES, {
    variables: { userId: currentUser?._id },
    skip: !currentUser?._id,
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
