import { Dimensions, FlatList, Image, View } from "react-native";
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

  const renderCollageItem = ({ item }) => (
    <CollageCard path={item.coverImage} />
  );

  return (
    <View styles={layoutStyles.container}>
      <HeaderStack
        title={"Saved"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View>
        <FlatList
          data={data?.getSavedCollages}
          renderItem={renderCollageItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={3}
        />
      </View>
    </View>
  );
}
