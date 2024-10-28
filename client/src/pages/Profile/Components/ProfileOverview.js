import React, { useState, useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import ButtonSkinny from "../../../components/Buttons/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import { BASE_URL } from "../../../utils/config";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../../../utils/mutations/userRelationsMutations";

export default function ProfileOverview({
  profile,
  followerData,
  isAdminView,
  isAdminScreen,
  isFollowing: initialIsFollowing, // Use prop passed from Profile component
}) {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth();
  const userId = profile._id;

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [buttonState, setButtonState] = useState("Follow");

  // Mutations
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  useEffect(() => {
    let hasPendingRequest = false;

    if (profile.followRequests) {
      hasPendingRequest = profile.followRequests.some(
        (req) => req._id === currentUser._id
      );
    }

    setIsPendingRequest(hasPendingRequest);

    if (isFollowing) {
      setButtonState("Following");
    } else if (hasPendingRequest) {
      setButtonState("Pending Request");
    } else {
      setButtonState("Follow");
    }
  }, [isFollowing, profile.followRequests, currentUser]);

  const handleFollow = async () => {
    try {
      if (profile.isProfilePrivate) {
        const { data } = await sendFollowRequest({
          variables: { userIdToFollow: userId },
        });
        Alert.alert("Request Sent", data.sendFollowRequest.message);
        setIsPendingRequest(true);
        setButtonState("Pending Request");
      } else {
        const { data } = await followUser({
          variables: { userIdToFollow: userId },
        });
        Alert.alert("Follow", data.followUser.message);
        setIsFollowing(true); // Update local state
        setFollowerCount((prevCount) => prevCount + 1); // Increment follower count
        setButtonState("Following");
        updateCurrentUser((prevUser) => ({
          ...prevUser,
          following: [...prevUser.following, userId],
        }));
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const { data } = await unfollowUser({
        variables: { userIdToUnfollow: userId },
      });
      Alert.alert("Unfollow", data.unfollowUser.message);
      setIsFollowing(false); // Update local state
      setFollowerCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrement follower count
      setButtonState("Follow");
      updateCurrentUser((prevUser) => ({
        ...prevUser,
        following: prevUser.following.filter((id) => id !== userId),
      }));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnsendRequest = async () => {
    try {
      const { data } = await unsendFollowRequest({
        variables: { userIdToUnfollow: userId },
      });
      Alert.alert("Request Withdrawn", data.unsendFollowRequest.message);
      setIsPendingRequest(false); // Update local state
      setButtonState("Follow");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
                {profile.collagesCount}
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
                {followerData.followersCount}
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
                {followerData.followingCount}
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
              {buttonState === "Following" ? (
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
              ) : buttonState === "Pending Request" ? (
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
