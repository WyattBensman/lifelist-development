import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import FriendRequestCard from "../Cards/FriendRequestCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_FOLLOW_REQUESTS } from "../../../utils/queries";
import Icon from "../../../components/Icons/Icon";

export default function FriendRequest({ navigation }) {
  const { data, loading, error } = useQuery(GET_FOLLOW_REQUESTS);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }) => (
    <FriendRequestCard
      fullName={item.fullName}
      profilePicture={item.profilePicture}
      username={item.username}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Friend Request"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="person.badge.plus"
            onPress={() => navigation.goBack()}
            style={iconStyles.addFriends}
            weight="semibold"
          />
        }
      />
      <FlatList
        data={data.getFollowRequests.filter((request) => request !== null)}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}
