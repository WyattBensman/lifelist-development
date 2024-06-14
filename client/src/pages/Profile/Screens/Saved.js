import React from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_SAVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";

const { height: screenHeight } = Dimensions.get("window");

export default function Saved() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_SAVED_COLLAGES);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const filteredCollages = data?.getSavedCollages.filter(
    (item) => !item.archived
  );

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Saved"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <FlatList
        data={filteredCollages}
        renderItem={({ item, index }) => (
          <View style={{ height: screenHeight }}>
            <CollageCard
              collageId={item._id}
              path={item.coverImage}
              index={index}
              collages={filteredCollages}
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
