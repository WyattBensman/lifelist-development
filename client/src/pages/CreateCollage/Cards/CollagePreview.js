import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { useAuth } from "../../../../src/contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function CollagePreview({ images, caption }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <FlatList
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
        />
        {images.length > 1 && (
          <View style={styles.indicatorContainer}>
            {images.map((_, index) => (
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
            <Image
              style={styles.profilePicture}
              source={{
                uri: `${BASE_URL}${currentUser.profilePicture}`,
              }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>{currentUser.fullName}</Text>
              <Text style={styles.location}>Location unknown</Text>
            </View>
          </View>
          <Icon
            name="ellipsis"
            style={iconStyles.collageEllipsis}
            tintColor={"#ffffff"}
            backgroundColor={"rgba(38, 40, 40, 0.3)"}
          />
        </View>
        <View style={styles.actionContainer}>
          <Icon name="heart" style={iconStyles.heart} tintColor={"#ffffff"} />
          <Icon
            name="bubble"
            style={iconStyles.comment}
            spacer={16}
            tintColor={"#ffffff"}
          />
          <Icon
            name="arrow.2.squarepath"
            style={iconStyles.repost}
            spacer={16}
            tintColor={"#ffffff"}
          />
          <Icon
            name="bookmark"
            style={iconStyles.bookmark}
            spacer={16}
            tintColor={"#ffffff"}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.captionContainer}>
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
            <View style={styles.commentsButton}>
              <Text style={styles.commentsButtonText}>Comments</Text>
            </View>
            <View style={[styles.participantsButton, { marginLeft: 8 }]}>
              <Text style={styles.participantsButtonText}>Participants</Text>
            </View>
          </View>
        </View>
      </View>
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
    backgroundColor: "#d4d4d4",
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
    height: 36,
    width: 36,
    borderRadius: 4,
    borderColor: "#ffffff",
    borderWidth: 1.5,
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
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(38, 40, 40, 0.3)",
    borderRadius: 32,
    paddingHorizontal: 12,
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
});
