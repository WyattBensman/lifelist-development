import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonSkinny from "../../../components/Buttons/ButtonSkinny";
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
import { BASE_URL } from "../../../utils/config";

export default function ProfileOverview({
  profile,
  isAdminView,
  isAdminScreen,
}) {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth();
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  const userId = profile._id;

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
    await unfollowUser({ variables: { userId: profile._id } });
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

  // Construct the full URL for the profile picture
  const profilePictureUrl = `${BASE_URL}${profile.profilePicture}`;

  return (
    <View
      style={[
        layoutStyles.marginMd,
        layoutStyles.marginBtmXs,
        { marginBottom: 0 },
      ]}
    >
      <View style={[layoutStyles.flex, { height: 100 }]}>
        <Image
          source={{ uri: profilePictureUrl }}
          style={styles.profilePicture}
        />
        <View style={styles.rightContainer}>
          <View
            style={[layoutStyles.flexSpaceBetween, layoutStyles.marginHorMd]}
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
                isAdminScreen
                  ? navigation.push("ProfileStack", {
                      screen: "UserRelations",
                      params: {
                        screen: "Followers",
                        params: {
                          userId: profile._id,
                          initialTab: "Followers",
                        },
                      },
                    })
                  : navigation.push("UserRelations", {
                      screen: "Followers",
                      params: { userId: profile._id, initialTab: "Followers" },
                    })
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
                isAdminScreen
                  ? navigation.push("ProfileStack", {
                      screen: "UserRelations",
                      params: {
                        screen: "Following",
                        params: {
                          userId: profile._id,
                          initialTab: "Following",
                        },
                      },
                    })
                  : navigation.push("UserRelations", {
                      screen: "Following",
                      params: { userId: profile._id, initialTab: "Following" },
                    })
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
              onPress={() => navigation.push("EditProfile")}
              text="Edit Profile"
              backgroundColor="#ececec"
              textColor="#262828"
            />
          ) : (
            <>
              {isFollowing ? (
                <View style={styles.buttonRow}>
                  <ButtonSkinny
                    onPress={handleUnfollow}
                    text="Following"
                    backgroundColor="#ececec"
                    textColor="#6AB952"
                    style={{ flex: 1, marginRight: 4 }}
                  />
                  <ButtonSkinny
                    onPress={() =>
                      navigation.push("Message", { user: profile })
                    }
                    text="Message"
                    backgroundColor="#ececec"
                    textColor="#262828"
                    style={{ flex: 1, marginLeft: 4 }}
                  />
                </View>
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
      <View style={[layoutStyles.marginTopXs, { marginTop: 6 }]}>
        <Text style={{ fontWeight: "bold" }}>@{profile.username}</Text>
        <Text style={{ marginTop: 2 }}>{profile.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightContainer: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 11,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  messageButton: {
    marginLeft: 8,
  },
});
