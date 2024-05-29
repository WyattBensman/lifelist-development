import { FlatList, Alert } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import { GET_FOLLOWERS } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";

export default function Followers({ userId }) {
  const { currentUser } = useAuth();

  const { data, loading, error } = useQuery(GET_FOLLOWERS, {
    variables: { userId },
  });

  // Mutations
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  // Handle action press based on user's privacy setting
  const handleActionPress = async (userId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          const { data } = await sendFollowRequest({
            variables: { userIdToFollow: userId },
          });
          // Set action to "Requested"
          Alert.alert("Request Sent", data.sendFollowRequest.message);
        } else {
          const { data } = await followUser({
            variables: { userIdToFollow: userId },
          });
          // Set action to "Unfollow"
          Alert.alert("Follow", data.followUser.message);
        }
      } else if (action === "Following") {
        const { data } = await unfollowUser({
          variables: { userIdToUnfollow: userId },
        });
        // Set action to "Follow"
        Alert.alert("Unfollow", data.unfollowUser.message);
      } else if (action === "Requested") {
        const { data } = await unsendFollowRequest({
          variables: { userIdToUnfollow: userId },
        });
        // Set action to "Follow"
        Alert.alert("Request Withdrawn", data.unsendFollowRequest.message);
      }
    } catch (error) {
      Alert.alert("Action Error", error.message);
    }
  };

  const renderFollowerItem = ({ item }) => {
    let action = "Follow";
    if (currentUser.following.includes(item._id)) {
      action = "Following";
    } else if (item.followRequests.some((req) => req._id === currentUser._id)) {
      action = "Requested";
    }

    return (
      <UserRelationsCard
        user={item}
        action={action}
        onActionPress={(action) =>
          handleActionPress(item._id, action, item.isProfilePrivate)
        }
      />
    );
  };

  return (
    <FlatList
      data={data?.getFollowers}
      renderItem={renderFollowerItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
      contentContainerStyle={layoutStyles.paddingTopXs}
    />
  );
}
