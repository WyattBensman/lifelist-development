import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_MOMENTS } from "../../../utils/queries/momentQueries";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import {
  MARK_MOMENT_AS_VIEWED,
  LIKE_MOMENT,
  UNLIKE_MOMENT,
} from "../../../utils/mutations/momentMutations";
import { useAuth } from "../../../contexts/AuthContext";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;
const MOMENT_DURATION = 10000; // 10 seconds

export default function Moments() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { setIsTabBarVisible } = useNavigationContext();
  const { removeMoment } = useAdminProfile();
  const { currentUser } = useAuth();

  const [moments, setMoments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [markMomentAsViewed] = useMutation(MARK_MOMENT_AS_VIEWED);
  const [likeMoment] = useMutation(LIKE_MOMENT);
  const [unlikeMoment] = useMutation(UNLIKE_MOMENT);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);
      return () => setIsTabBarVisible(true);
    }, [setIsTabBarVisible])
  );

  const { data, loading, error } = useQuery(GET_USER_MOMENTS, {
    variables: { userId },
    fetchPolicy: "network-only",
  });

  const startTimer = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: MOMENT_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNextMoment();
    });
  };

  const resetTimer = () => {
    progressAnim.setValue(0);
    startTimer();
  };

  const markAsViewed = async (momentId) => {
    try {
      await markMomentAsViewed({ variables: { momentId } });
    } catch (err) {
      console.error("Error marking moment as viewed:", err);
    }
  };

  const handleLikeMoment = async (momentId) => {
    try {
      setIsLiked(true); // Optimistically update state
      const response = await likeMoment({ variables: { momentId } });
      if (!response.data.likeMoment.success) {
        setIsLiked(false); // Revert if the mutation fails
      }
    } catch (error) {
      console.error("Error liking moment:", error.message);
      setIsLiked(false); // Revert on error
    }
  };

  const handleUnlikeMoment = async (momentId) => {
    try {
      setIsLiked(false); // Optimistically update state
      const response = await unlikeMoment({ variables: { momentId } });
      if (!response.data.unlikeMoment.success) {
        setIsLiked(true); // Revert if the mutation fails
      }
    } catch (error) {
      console.error("Error unliking moment:", error.message);
      setIsLiked(true); // Revert on error
    }
  };

  useEffect(() => {
    if (data?.getUserMoments) {
      const fetchedMoments = data.getUserMoments;
      setMoments(fetchedMoments);

      // Log all views being checked
      const firstUnviewedIndex = fetchedMoments.findIndex((moment, index) => {
        const isViewed = moment.views.some(
          (view) => String(view._id) === String(userId)
        );
        return !isViewed;
      });

      const startIndex = firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0;

      setCurrentIndex(startIndex);
      resetTimer();
    }
  }, [data]);

  useEffect(() => {
    if (moments.length > 0) {
      const likedByUser = moments[currentIndex].likes.some(
        (like) => like._id === userId
      );
      setIsLiked(likedByUser);
      markAsViewed(moments[currentIndex]._id);
      resetTimer();
    }
  }, [currentIndex]);

  const handleNextMoment = () => {
    if (currentIndex < moments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevMoment = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      resetTimer();
    }
  };

  const handleDeleteMoment = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const updatedMoments = moments.filter(
        (_, index) => index !== currentIndex
      );

      await removeMoment(moments[currentIndex]._id); // Call to remove moment in backend/cache

      if (updatedMoments.length > 0) {
        setMoments(updatedMoments); // Update local moments state

        // Set next index and restart the progress bar
        const nextIndex =
          currentIndex < updatedMoments.length
            ? currentIndex
            : currentIndex - 1;
        setCurrentIndex(nextIndex);
        resetTimer();
      } else {
        // If no moments are left, navigate back
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting moment:", error);
    } finally {
      setIsDeleteAlertVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || moments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No moments to display.</Text>
      </View>
    );
  }

  const currentMoment = moments[currentIndex];
  const isAuthor = currentMoment.author._id === currentUser;

  return (
    <View style={layoutStyles.wrapper}>
      <ViewShotHeader
        arrow={
          <Icon
            name="xmark"
            style={iconStyles.exit}
            onPress={() => navigation.goBack()}
            weight="semibold"
          />
        }
        ellipsis={
          <Icon
            name={isAuthor ? "trash" : "flag"}
            style={styles.trashIcon}
            weight="bold"
            noFill={true}
            tintColor={isAuthor ? "red" : "#FF6347"}
            onPress={
              isAuthor
                ? handleDeleteMoment
                : () =>
                    navigation.navigate("Report", {
                      entityId: currentMoment._id,
                      entityType: "MOMENT",
                    })
            }
          />
        }
        hasBorder={false}
      />

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        {moments.map((_, i) => (
          <View key={i} style={styles.progressSegment}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                      ? progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        })
                      : "0%",
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Touchable Area for Navigation */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchableContainer}
        onPress={(e) => {
          const touchX = e.nativeEvent.locationX;
          if (touchX < width / 2) {
            handlePrevMoment();
          } else {
            handleNextMoment();
          }
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentMoment.cameraShot.image }}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.bottomContainer}>
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: currentMoment.author.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.fullName}>{currentMoment.author.fullName}</Text>
            <Text style={styles.username}>
              @{currentMoment.author.username}
            </Text>
          </View>
        </View>
        <Icon
          name={isLiked ? "heart.fill" : "heart"}
          tintColor={isLiked ? "#ff0000" : "#ffffff"}
          style={[
            iconStyles.like,
            isAuthor && { opacity: 0.5 }, // Apply opacity if isAuthor is true
          ]}
          weight="semibold"
          onPress={() => {
            if (!isAuthor) {
              isLiked
                ? handleUnlikeMoment(currentMoment._id)
                : handleLikeMoment(currentMoment._id);
            }
          }}
        />
      </View>

      {/* Delete Confirmation */}
      <DangerAlert
        visible={isDeleteAlertVisible}
        onRequestClose={() => setIsDeleteAlertVisible(false)}
        title="Delete Moment"
        message="Are you sure you want to delete this moment?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteAlertVisible(false)}
        cancelButtonText="Discard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "97.5%",
    alignSelf: "center",
    height: 3,
    justifyContent: "space-between",
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#555",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  touchableContainer: {
    height: imageHeight,
    width: width,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginRight: 12,
  },
  fullName: {
    color: "#fff",
    fontWeight: "bold",
  },
  username: {
    color: "#aaa",
    fontSize: 12,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "97.5%",
    height: "97.5%",
    resizeMode: "cover",
    borderRadius: 4,
  },
  trashIcon: {
    height: 18.28,
    width: 15,
  },
});
