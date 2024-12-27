import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import ListViewNavigator from "../Navigation/ListViewNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeList } from "../../../contexts/LifeListContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import DangerAlert from "../../../components/Alerts/DangerAlert";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const { lifeLists, removeLifeListExperienceFromCache } = useLifeList();

  const [editMode, setEditMode] = useState(false);
  const [viewType, setViewType] = useState("EXPERIENCED");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine user and LifeList details from route or context
  const userId = route.params?.userId || currentUser;
  const isCurrentUser = route.params?.isAdmin || userId === currentUser;
  const lifeList = lifeLists[userId] || { experiences: [] };

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, []);

  useEffect(() => {
    if (route.params?.editMode) {
      setEditMode(true);
    }
  }, [route.params?.editMode]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  const handleBackPress = () => {
    if (editMode && route.params?.fromScreen === "EditExperiences") {
      navigation.goBack();
    } else if (editMode) {
      setEditMode(false);
    } else {
      navigation.goBack();
    }
  };

  const handleDeleteExperience = (experienceId) => {
    setSelectedExperienceId(experienceId);
    setModalVisible(true);
  };

  const confirmDeleteExperience = async () => {
    try {
      await removeLifeListExperienceFromCache(
        selectedExperienceId,
        isCurrentUser
      );
    } catch (error) {
      console.error("Failed to remove experience:", error);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        icon1={
          !editMode &&
          route.params?.fromScreen === "HeaderIcon" && (
            <Icon
              name="square.and.pencil"
              style={iconStyles.squarePencilSm}
              onPress={toggleEditMode}
            />
          )
        }
        hasBorder={false}
        isSearchFocused={isSearchFocused} // Pass the state
        onSearchFocusChange={setIsSearchFocused} // Pass the setter
        searchQuery={searchQuery} // Pass the search query state
        setSearchQuery={setSearchQuery} // Pass the set state function
      />
      <View style={[layoutStyles.flex, styles.buttonContainer]}>
        <Pressable
          style={[
            styles.button,
            viewType === "EXPERIENCED" && styles.experiencedSelectedButton,
          ]}
          onPress={() => handleViewTypeChange("EXPERIENCED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "EXPERIENCED" &&
                styles.experiencedSelectedButtonText,
            ]}
          >
            Experienced
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            viewType === "WISHLISTED" && styles.wishlistedSelectedButton,
          ]}
          onPress={() => handleViewTypeChange("WISHLISTED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "WISHLISTED" && styles.wishlistedSelectedButtonText,
            ]}
          >
            Wish Listed
          </Text>
        </Pressable>
      </View>
      <ListViewNavigator
        lifeList={lifeList}
        viewType={viewType}
        editMode={editMode}
        navigation={navigation}
        onDelete={handleDeleteExperience}
        userId={userId}
      />
      <DangerAlert
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure you want to delete this experience?"
        onConfirm={confirmDeleteExperience}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 2,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#252525",
  },
  button: {
    width: "45%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#1C1C1C",
  },
  buttonText: {
    color: "#696969",
    fontWeight: "500",
  },
  experiencedSelectedButton: {
    backgroundColor: "#6AB95230", // Light green with opacity
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  experiencedSelectedButtonText: {
    color: "#6AB952",
  },
  wishlistedSelectedButton: {
    backgroundColor: "#5FC4ED30", // Light blue with opacity
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#5FC4ED50",
  },
  wishlistedSelectedButtonText: {
    color: "#5FC4ED",
  },
});
