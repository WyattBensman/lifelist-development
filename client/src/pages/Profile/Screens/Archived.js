import React from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_ARCHIVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

const { height: screenHeight } = Dimensions.get("window");

export default function Archived() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ARCHIVED_COLLAGES);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Archived"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <FlatList
        data={data?.getArchivedCollages}
        renderItem={({ item, index }) => (
          <View style={{ height: screenHeight }}>
            <CollageCard
              collageId={item._id}
              path={item.coverImage}
              index={index}
              collages={data?.getArchivedCollages}
            />
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={screenHeight}
        decelerationRate="fast"
      />
    </View>
  );
}
