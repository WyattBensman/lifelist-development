import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonSkinny from "../../../components/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../utils/mutations/userRelationsMutations";

export default function ProfileOverview({ profile, isAdminView }) {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth();
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  const isFollowing = currentUser.following?.includes(profile._id);
  const isPendingRequest = currentUser.pendingFollowRequests?.includes(
    profile._id
  );

  const handleFollow = async () => {
    if (profile.isPrivate) {
      await sendFollowRequest({ variables: { userIdToFollow: profile._id } });
      updateCurrentUser({
        pendingFollowRequests: [
          ...currentUser.pendingFollowRequests,
          profile._id,
        ],
      });
    } else {
      await followUser({ variables: { userIdToFollow: profile._id } });
      updateCurrentUser({
        following: [...currentUser.following, profile._id],
      });
    }
  };

  const handleUnfollow = async () => {
    await unfollowUser({ variables: { userIdToUnfollow: profile._id } });
    updateCurrentUser({
      following: currentUser.following.filter(
        (userId) => userId !== profile._id
      ),
    });
  };

  const handleUnsendRequest = async () => {
    await unsendFollowRequest({ variables: { userIdToUnfollow: profile._id } });
    updateCurrentUser({
      pendingFollowRequests: currentUser.pendingFollowRequests.filter(
        (userId) => userId !== profile._id
      ),
    });
  };

  return (
    <View style={[layoutStyles.marginMd, layoutStyles.marginBtmXs]}>
      <View style={[layoutStyles.flex, { height: 100 }]}>
        <Image
          source={{ uri: profile.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.rightContainer}>
          <View
            style={[layoutStyles.flexSpaceBetween, layoutStyles.marginHorSm]}
          >
            <View style={styles.col}>
              <Text style={{ fontWeight: "700" }}>
                {profile.collages.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Collages</Text>
            </View>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Followers" })
              }
            >
              <Text style={{ fontWeight: "700" }}>
                {profile.followers.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Followers</Text>
            </Pressable>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.navigate("UserRelations", { screen: "Following" })
              }
            >
              <Text style={{ fontWeight: "700" }}>
                {profile.following.length}
              </Text>
              <Text style={{ fontSize: 12 }}>Following</Text>
            </Pressable>
          </View>
          {isAdminView ? (
            <ButtonSkinny
              onPress={() => navigation.navigate("EditProfile")}
              text="Edit Profile"
              backgroundColor="#ececec"
              textColor="#262828"
            />
          ) : (
            <>
              {isFollowing ? (
                <>
                  <ButtonSkinny
                    onPress={handleUnfollow}
                    text="Following"
                    backgroundColor="#ececec"
                    textColor="#262828"
                  />
                  <ButtonSkinny
                    onPress={() =>
                      navigation.navigate("Message", { user: profile })
                    }
                    text="Message"
                    backgroundColor="#ececec"
                    textColor="#262828"
                  />
                </>
              ) : isPendingRequest ? (
                <ButtonSkinny
                  onPress={handleUnsendRequest}
                  text="Pending Request"
                  backgroundColor="#ececec"
                  textColor="#262828"
                />
              ) : (
                <ButtonSkinny
                  onPress={handleFollow}
                  text="Follow"
                  backgroundColor="#ececec"
                  textColor="#262828"
                />
              )}
            </>
          )}
        </View>
      </View>
      <View style={layoutStyles.marginTopXs}>
        <Text style={{ fontWeight: "500" }}>{profile.username}</Text>
        <Text style={layoutStyles.marginTopXxs}>{profile.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightContainer: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    height: "100%",
  },
  col: {
    alignItems: "center",
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
});
