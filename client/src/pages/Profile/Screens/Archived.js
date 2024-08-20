import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useQuery } from "@apollo/client";
import { GET_ARCHIVED_COLLAGES } from "../../../utils/queries/userQueries";
import CollageCard from "../Cards/CollageCard";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";

const { height: screenHeight } = Dimensions.get("window");

export default function Archived() {
  const navigation = useNavigation();
  const { data, loading, error, refetch } = useQuery(GET_ARCHIVED_COLLAGES);
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Archived"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
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
