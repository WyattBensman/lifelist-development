import { Dimensions, FlatList, Image, View, Text } from "react-native";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_SAVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

export default function Saved() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_SAVED_COLLAGES);

  const filteredCollages = data?.getSavedCollages.filter(
    (item) => !item.archived
  );

  const renderCollageItem = ({ item }) => (
    <CollageCard collageId={item._id} path={item.coverImage} />
  );

  return (
    <View styles={layoutStyles.container}>
      <HeaderStack
        title={"Saved"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View>
        <FlatList
          data={filteredCollages}
          renderItem={renderCollageItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={3}
        />
      </View>
    </View>
  );
}
