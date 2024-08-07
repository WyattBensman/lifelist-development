import React, { useState, useEffect } from "react";
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

  // Local state to manage follow and pending request status
  const [isFollowing, setIsFollowing] = useState(
    currentUser.following?.includes(userId)
  );
  const [isPendingRequest, setIsPendingRequest] = useState(false);

  useEffect(() => {
    // Update local state if currentUser changes
    setIsFollowing(currentUser.following?.includes(userId));
  }, [currentUser, userId]);

  const handleFollow = async () => {
    if (profile.isPrivate) {
      await sendFollowRequest({ variables: { userIdToFollow: userId } });
      setIsPendingRequest(true);
    } else {
      await followUser({ variables: { userIdToFollow: userId } });
      updateCurrentUser({
        following: [...currentUser.following, userId],
      });
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    await unfollowUser({ variables: { userId: userId } });
    updateCurrentUser({
      following: currentUser.following.filter((id) => id !== userId),
    });
    setIsFollowing(false);
  };

  const handleUnsendRequest = async () => {
    await unsendFollowRequest({ variables: { userIdToUnfollow: userId } });
    setIsPendingRequest(false);
  };

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
              <Text style={{ fontWeight: "700", color: "#fff" }}>
                {profile.collages.length}
              </Text>
              <Text style={{ fontSize: 12, color: "#fff" }}>Collages</Text>
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
              <Text style={{ fontWeight: "700", color: "#fff" }}>
                {profile.followers.length}
              </Text>
              <Text style={{ fontSize: 12, color: "#fff" }}>Followers</Text>
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
              <Text style={{ fontWeight: "700", color: "#fff" }}>
                {profile.following.length}
              </Text>
              <Text style={{ fontSize: 12, color: "#fff" }}>Following</Text>
            </Pressable>
          </View>
          {isAdminView ? (
            <ButtonSkinny
              onPress={() => navigation.push("EditProfile")}
              text="Edit Profile"
              backgroundColor="#252525"
              textColor="#fff"
            />
          ) : (
            <>
              {isFollowing ? (
                <View style={styles.buttonRow}>
                  <ButtonSkinny
                    onPress={handleUnfollow}
                    text="Following"
                    backgroundColor="#222"
                    textColor="#6AB952"
                    style={{ flex: 1, marginRight: 4 }}
                  />
                  <ButtonSkinny
                    onPress={() =>
                      navigation.push("Message", { user: profile })
                    }
                    text="Message"
                    backgroundColor="#222"
                    textColor="#fff"
                    style={{ flex: 1, marginLeft: 4 }}
                  />
                </View>
              ) : isPendingRequest ? (
                <ButtonSkinny
                  onPress={handleUnsendRequest}
                  text="Pending Request"
                  backgroundColor="#222"
                  textColor="#fff"
                />
              ) : (
                <ButtonSkinny
                  onPress={handleFollow}
                  text="Follow"
                  backgroundColor="#222"
                  textColor="#fff"
                />
              )}
            </>
          )}
        </View>
      </View>
      <View style={[layoutStyles.marginTopXs, { marginTop: 6 }]}>
        <Text style={{ fontWeight: "bold", color: "#fff" }}>
          @{profile.username}
        </Text>
        <Text style={{ marginTop: 2, color: "#fff" }}>{profile.bio}</Text>
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

/* import React, { useState, useEffect } from "react";
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

  // Local state to manage follow and pending request status
  const [isFollowing, setIsFollowing] = useState(
    currentUser.following?.includes(userId)
  );
  const [isPendingRequest, setIsPendingRequest] = useState(
    currentUser.pendingFriendRequests?.includes(userId)
  );

  useEffect(() => {
    // Update local state if currentUser changes
    setIsFollowing(currentUser.following?.includes(userId));
    setIsPendingRequest(currentUser.pendingFriendRequests?.includes(userId));
  }, [currentUser, userId]);

  const handleFollow = async () => {
    if (profile.isPrivate) {
      await sendFollowRequest({ variables: { userIdToFollow: userId } });
      updateCurrentUser({
        pendingFriendRequests: [...currentUser.pendingFriendRequests, userId],
      });
      setIsPendingRequest(true);
    } else {
      await followUser({ variables: { userIdToFollow: userId } });
      updateCurrentUser({
        following: [...currentUser.following, userId],
      });
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    await unfollowUser({ variables: { userId: userId } });
    updateCurrentUser({
      following: currentUser.following.filter((id) => id !== userId),
    });
    setIsFollowing(false);
  };

  const handleUnsendRequest = async () => {
    await unsendFollowRequest({ variables: { userIdToUnfollow: userId } });
    updateCurrentUser({
      pendingFriendRequests: currentUser.pendingFriendRequests.filter(
        (id) => id !== userId
      ),
    });
    setIsPendingRequest(false);
  };

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
}); */
