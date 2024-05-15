import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import BlockedUserCard from "../Cards/BlockedUserCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { layoutStyles } from "../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_BLOCKED_USERS } from "../../../utils/queries/userQueries";
import { UNBLOCK_USER } from "../../../utils/mutations/userRelationsMutations";

export default function BlockedUsers() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_BLOCKED_USERS);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Initialize the blocked users state when data is fetched
  useEffect(() => {
    if (data) {
      setBlockedUsers(data.getBlockedUsers);
    }
  }, [data]);

  const [unblockUserMutation] = useMutation(UNBLOCK_USER, {
    onCompleted: (data) => {
      if (data.unblockUser.success) {
        // Update the state to remove the unblocked user
        setBlockedUsers((currentUsers) =>
          currentUsers.filter((user) => user._id !== data.unblockUser.userId)
        );
      }
    },
  });

  const handleUnblock = (userId) => {
    unblockUserMutation({ variables: { userId } });
  };

  const renderBlockedUserCard = ({ item }) => (
    <BlockedUserCard
      userId={item._id}
      fullName={item.fullName}
      username={item.username}
      profilePicture={item.profilePicture}
      onUnblock={handleUnblock}
    />
  );

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Blocked Users"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View>
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUserCard}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </View>
  );
}
