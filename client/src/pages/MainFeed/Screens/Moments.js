import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useQuery } from "@apollo/client";
import HeaderSearchBar from "../../../components/Headers/HeaderSearchBar";
import RecommendedMomentCard from "../Cards/RecommendedMomentCard";
import { GET_FRIENDS_MOMENTS } from "../../../utils/queries/momentQueries";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";

const screenWidth = Dimensions.get("window").width;
const momentWidth = (screenWidth - 16 * 2 - 6) / 2;
const momentHeight = momentWidth * 1.5;

export default function Moments({ navigation }) {
  const [cursor, setCursor] = useState(null);
  const [moments, setMoments] = useState([]);

  const { data, loading, error, fetchMore } = useQuery(GET_FRIENDS_MOMENTS, {
    variables: { cursor: null, limit: 12 },
    fetchPolicy: "network-only",
    onCompleted: (response) => {
      if (response?.getFriendsMoments?.moments) {
        setMoments(response.getFriendsMoments.moments);
        setCursor(response.getFriendsMoments.nextCursor);
      }
    },
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const fetchMoreMoments = () => {
    if (cursor) {
      fetchMore({
        variables: { cursor, limit: 12 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            getFriendsMoments: {
              ...fetchMoreResult.getFriendsMoments,
              moments: [
                ...prev.getFriendsMoments.moments,
                ...fetchMoreResult.getFriendsMoments.moments,
              ],
            },
          };
        },
      });
    }
  };

  if (loading && !moments.length) {
    return (
      <View style={layoutStyles.wrapper}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={layoutStyles.wrapper}>
        <Text style={styles.errorText}>
          Something went wrong: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
      />
      <Text style={styles.sectionTitle}>Moments</Text>
      <FlatList
        data={moments}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <RecommendedMomentCard moment={item} navigation={navigation} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreMoments}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          cursor && <ActivityIndicator size="small" color="#fff" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 24,
    marginHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
