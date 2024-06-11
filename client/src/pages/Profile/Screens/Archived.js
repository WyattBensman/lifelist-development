import { Dimensions, FlatList, Image, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_ARCHIVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

export default function Archived() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ARCHIVED_COLLAGES);

  const renderCollageItem = ({ item }) => (
    <CollageCard collageId={item._id} path={item.coverImage} />
  );

  return (
    <View styles={layoutStyles.container}>
      <HeaderStack
        title={"Archived"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View>
        <FlatList
          data={data?.getArchivedCollages}
          renderItem={renderCollageItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={3}
        />
      </View>
    </View>
  );
}
