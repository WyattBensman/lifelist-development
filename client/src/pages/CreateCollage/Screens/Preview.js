import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import IconCollage from "../../../components/Icons/IconCollage";
import { useAuth } from "../../../contexts/AuthContext";
import Participants from "../Popups/Participants";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { CREATE_COLLAGE } from "../../../utils/mutations/collageCreationMutations";

const { width } = Dimensions.get("window");

export default function CollagePreview() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImages, caption, taggedUsers } = route.params;

  const [showParticipants, setShowParticipants] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [createCollage] = useMutation(CREATE_COLLAGE, {
    onCompleted: () => {
      navigation.navigate("MainFeed", { refresh: true });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const renderItem = ({ item }) => (
    <Image
      style={styles.image}
      source={{
        uri: `${BASE_URL}${item.image}`,
      }}
    />
  );

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handlePostCollage = () => {
    createCollage({
      variables: {
        caption,
        images: selectedImages.map((image) => image.image),
        taggedUsers: taggedUsers.map((user) => user._id),
      },
    });
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Preview"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={handlePostCollage}>
            <Text style={styles.createButtonTextActive}>Post</Text>
          </Pressable>
        }
      />
      <View style={styles.imageContainer}>
        <FlatList
          data={selectedImages}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
        {selectedImages.length > 1 && (
          <View style={styles.indicatorContainer}>
            {selectedImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
        )}
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <Pressable>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: `${BASE_URL}${currentUser.profilePicture}`,
                }}
              />
            </Pressable>
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>{currentUser.fullName}</Text>
              <Text style={styles.location}>Location unknown</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <Pressable>
            <IconCollage
              name={"heart"}
              style={iconStyles.like}
              weight={"medium"}
              tintColor={"#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
            />
          </Pressable>
          <Pressable style={styles.iconSpacer}>
            <IconCollage
              name="arrow.2.squarepath"
              style={iconStyles.repost}
              weight={"medium"}
              tintColor={"#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
            />
          </Pressable>
          <Pressable style={styles.iconSpacer}>
            <IconCollage
              name="text.bubble"
              style={iconStyles.comment}
              weight={"medium"}
              tintColor={"#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
            />
          </Pressable>
          <Pressable style={styles.iconSpacer}>
            <IconCollage
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight={"bold"}
              tintColor={"#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.captionContainer}>
          <Pressable>
            <Image
              style={styles.smallProfilePicture}
              source={{
                uri: `${BASE_URL}${currentUser.profilePicture}`,
              }}
            />
          </Pressable>
          <View style={styles.captionTextContainer}>
            <Text style={styles.caption}>
              <Text style={styles.username}>{currentUser.username} </Text>
              {caption}
            </Text>
          </View>
        </View>
        <View style={styles.bottomTextContainer}>
          <View style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Pressable>
              <View style={styles.commentsButton}>
                <Text style={styles.commentsButtonText}>Comments</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowParticipants(true)}>
              <View style={[styles.participantsButton, { marginLeft: 8 }]}>
                <Text style={styles.participantsButtonText}>Participants</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <Participants
        visible={showParticipants}
        onRequestClose={() => setShowParticipants(false)}
        taggedUsers={taggedUsers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width, // Use screen width for FlatList images
    height: width * (3 / 2), // Maintain aspect ratio of 2:3
  },
  topContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    height: 35,
    width: 35,
    borderRadius: 4,
    borderColor: "rgba(38, 40, 40, 0.3)",
    borderWidth: 2,
    marginRight: 6,
  },
  fullName: {
    fontWeight: "600",
    color: "#fff",
  },
  username: {
    fontWeight: "600",
    color: "#fff",
  },
  location: {
    fontSize: 12,
    color: "#fff",
  },
  actionContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "column", // Changed to column for vertical alignment
    alignItems: "center",
  },
  iconSpacer: {
    marginTop: 12, // Adds spacing between icons
  },
  bottomContainer: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: 12,
    justifyContent: "space-between",
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the top
  },
  captionTextContainer: {
    flex: 1, // Allow caption text to take available space
    justifyContent: "flex-start", // Align caption text to the top
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  caption: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    color: "#fff",
  },
  dateButton: {
    backgroundColor: "#1C1C1C", // Dark background for Date button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButtonText: {
    color: "#696969", // Light grey text
    fontSize: 12,
    fontWeight: "500",
  },
  commentsButton: {
    backgroundColor: "#252525", // Darker background for Comments button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsButtonText: {
    color: "#fff", // White text
    fontSize: 12,
    fontWeight: "500",
  },
  participantsButton: {
    backgroundColor: "#252525", // Darker background for Participants button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  participantsButtonText: {
    color: "#fff", // White text
    fontSize: 12,
    fontWeight: "500",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: 2,
    width: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 2,
    borderRadius: 2,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
  createButtonText: {
    fontSize: 12,
    color: "#696969",
    fontWeight: "600",
  },
  createButtonTextActive: {
    color: "#6AB952",
    fontWeight: "600",
  },
});
