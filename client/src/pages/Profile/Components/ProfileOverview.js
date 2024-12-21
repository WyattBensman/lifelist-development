import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { Image } from "expo-image";
import ButtonSkinny from "../../../components/Buttons/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useProfile } from "../../../contexts/ProfileContext";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";

export default function ProfileOverview({
  profile,
  userId,
  followerData,
  isAdminView,
  isRestricted,
  isAdminScreen,
}) {
  const navigation = useNavigation();

  // Select the relevant context
  const {
    followUser,
    unfollowUser,
    sendFollowRequest,
    unsendFollowRequest,
    incrementFollowing,
    decrementFollowing,
  } = useProfile();

  const { incrementFollowers, decrementFollowers } = useAdminProfile();

  const [buttonState, setButtonState] = useState("");
  const [showDangerAlert, setShowDangerAlert] = useState(false);

  useEffect(() => {
    if (isRestricted) {
      setButtonState("Follow"); // No actions available
    } else if (isAdminView) {
      setButtonState("Edit Profile");
    } else if (profile.isFollowing) {
      setButtonState("Following");
    } else if (profile.isFollowRequested) {
      setButtonState("Pending Request");
    } else {
      setButtonState("Follow");
    }
  }, [isAdminView, profile, isRestricted]);

  // === Handlers ===
  const handleFollow = async () => {
    if (isRestricted) return;
    try {
      if (profile.isProfilePrivate) {
        await sendFollowRequest(userId);
        setButtonState("Pending Request");
        Alert.alert("Request Sent", "Follow request sent.");
      } else {
        await followUser(userId);
        setButtonState("Following");
        incrementFollowers(userId); // Update follower count
        if (isAdminView) incrementFollowing(currentUser);
        Alert.alert("Followed", "You are now following this user.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnfollow = async () => {
    if (isRestricted) return;
    try {
      await unfollowUser(userId);
      setButtonState("Follow");
      decrementFollowers(userId); // Update follower count
      if (isAdminView) decrementFollowing(currentUser);
      Alert.alert("Unfollowed", "You have unfollowed this user.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmUnfollow = () => {
    if (profile.isProfilePrivate) {
      // Show Danger Alert for private profiles
      setShowDangerAlert(true);
    } else {
      // Proceed with normal unfollow for public profiles
      handleUnfollow();
    }
  };

  const handleUnsendRequest = async () => {
    if (isRestricted) return;
    try {
      await unsendFollowRequest(userId);
      setButtonState("Follow");
      Alert.alert("Request Withdrawn", "Follow request has been withdrawn.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      <View
        style={[
          layoutStyles.marginMd,
          layoutStyles.marginBtmXs,
          { marginBottom: 0 },
        ]}
      >
        {/* Profile Header */}
        <View style={[layoutStyles.flex, { height: 100 }]}>
          <Image
            source={{ uri: profile?.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={styles.rightContainer}>
            <View
              style={[layoutStyles.flexSpaceBetween, layoutStyles.marginHorMd]}
            >
              {/* Collages, Followers, Following */}
              <View style={styles.col}>
                <Text style={{ fontWeight: "700", color: "#fff" }}>
                  {followerData?.collagesCount || 0}
                </Text>
                <Text style={{ fontSize: 12, color: "#fff" }}>Collages</Text>
              </View>
              <Pressable
                style={styles.col}
                onPress={() =>
                  isAdminScreen
                    ? navigation.navigate("ProfileStack", {
                        screen: "UserRelations",
                        params: { userId: userId, initialTab: "Followers" },
                      })
                    : navigation.push("UserRelations", {
                        userId: userId,
                        initialTab: "Followers",
                      })
                }
              >
                <Text style={{ fontWeight: "700", color: "#fff" }}>
                  {followerData?.followersCount || 0}
                </Text>
                <Text style={{ fontSize: 12, color: "#fff" }}>Followers</Text>
              </Pressable>
              <Pressable
                style={styles.col}
                onPress={() =>
                  isAdminScreen
                    ? navigation.navigate("ProfileStack", {
                        screen: "UserRelations",
                        params: { userId: userId, initialTab: "Following" },
                      })
                    : navigation.push("UserRelations", {
                        userId: userId,
                        initialTab: "Following",
                      })
                }
              >
                <Text style={{ fontWeight: "700", color: "#fff" }}>
                  {followerData?.followingCount || 0}
                </Text>
                <Text style={{ fontSize: 12, color: "#fff" }}>Following</Text>
              </Pressable>
            </View>

            {/* Buttons */}
            {isAdminView ? (
              <ButtonSkinny
                onPress={() => navigation.push("EditProfile")}
                text="Edit Profile"
                backgroundColor="#252525"
                textColor="#fff"
              />
            ) : buttonState === "Following" ? (
              <View style={styles.buttonRow}>
                <ButtonSkinny
                  onPress={confirmUnfollow}
                  text="Following"
                  backgroundColor="#222"
                  textColor="#6AB952"
                  style={{ flex: 1, marginRight: 4 }}
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
          </View>
        </View>

        {/* Bio Section */}
        <View style={[layoutStyles.marginTopXs, { marginTop: 6 }]}>
          <Text style={{ fontWeight: "bold", color: "#fff" }}>
            @{profile?.username}
          </Text>
          <Text style={{ marginTop: 2, color: "#fff" }}>{profile?.bio}</Text>
        </View>
      </View>

      {/* Danger Alert for Unfollowing */}
      <DangerAlert
        visible={showDangerAlert}
        onRequestClose={() => setShowDangerAlert(false)}
        title="Unfollow User?"
        message="If you unfollow this private user, you will lose access to their content. Are you sure?"
        onConfirm={() => {
          setShowDangerAlert(false);
          handleUnfollow(); // Proceed with unfollow
        }}
        onCancel={() => setShowDangerAlert(false)} // Close alert
        confirmButtonText="Unfollow"
        cancelButtonText="Cancel"
      />
    </>
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
});
