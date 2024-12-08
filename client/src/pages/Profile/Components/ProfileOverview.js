import React, { useState, useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import ButtonSkinny from "../../../components/Buttons/ButtonSkinny";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useProfileCache } from "../../../contexts/ProfileCacheContext";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../../../utils/mutations/userRelationsMutations";
import { useMutation } from "@apollo/client";

export default function ProfileOverview({
  profile,
  userId,
  followerData,
  isAdminView,
  isAdminScreen,
}) {
  const navigation = useNavigation();
  const { followUser, unfollowUser, sendFollowRequest, unsendFollowRequest } =
    useProfileCache();

  const [buttonState, setButtonState] = useState("Follow");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPendingRequest, setIsPendingRequest] = useState(false);

  useEffect(() => {
    // Determine the button state based on following and pending status
    const hasPendingRequest =
      profile?.followRequests?.some((req) => req._id === userId) || false;

    setIsPendingRequest(hasPendingRequest);

    if (isAdminView) {
      setButtonState("Edit Profile");
    } else if (isFollowing) {
      setButtonState("Following");
    } else if (hasPendingRequest) {
      setButtonState("Pending Request");
    } else {
      setButtonState("Follow");
    }
  }, [isFollowing, isAdminView, profile?.followRequests, userId]);

  const handleFollow = async () => {
    try {
      if (profile?.isProfilePrivate) {
        const response = await sendFollowRequest(userId);
        Alert.alert(
          "Request Sent",
          response?.message || "Follow request sent."
        );
        setIsPendingRequest(true);
        setButtonState("Pending Request");
      } else {
        const response = await followUser(userId);
        Alert.alert("Follow", response?.message || "You are now following.");
        setIsFollowing(true);
        setButtonState("Following");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await unfollowUser(userId);
      Alert.alert("Unfollow", response?.message || "Unfollowed successfully.");
      setIsFollowing(false);
      setButtonState("Follow");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnsendRequest = async () => {
    try {
      const response = await unsendFollowRequest(userId);
      Alert.alert(
        "Request Withdrawn",
        response?.message || "Request withdrawn."
      );
      setIsPendingRequest(false);
      setButtonState("Follow");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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
          source={{ uri: profile?.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.rightContainer}>
          <View
            style={[layoutStyles.flexSpaceBetween, layoutStyles.marginHorMd]}
          >
            <View style={styles.col}>
              <Text style={{ fontWeight: "700", color: "#fff" }}>
                {followerData?.collagesCount || 0}
              </Text>
              <Text style={{ fontSize: 12, color: "#fff" }}>Collages</Text>
            </View>
            <Pressable
              style={styles.col}
              onPress={() =>
                navigation.push("UserRelations", {
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
                navigation.push("UserRelations", {
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
                onPress={handleUnfollow}
                text="Following"
                backgroundColor="#222"
                textColor="#6AB952"
                style={{ flex: 1, marginRight: 4 }}
              />
              <ButtonSkinny
                onPress={() => navigation.push("Message", { user: profile })}
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
        </View>
      </View>
      <View style={[layoutStyles.marginTopXs, { marginTop: 6 }]}>
        <Text style={{ fontWeight: "bold", color: "#fff" }}>
          @{profile?.username}
        </Text>
        <Text style={{ marginTop: 2, color: "#fff" }}>{profile?.bio}</Text>
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
});
