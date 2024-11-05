import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import ListViewNavigator from "../Navigation/ListViewNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useMutation } from "@apollo/client";
import { REMOVE_EXPERIENCE_FROM_LIFELIST } from "../../../utils/mutations";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import LoadingScreen from "../../Loading/LoadingScreen";
import CustomAlert from "../../../components/Alerts/CustomAlert";
import Icon from "../../../components/Icons/Icon";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [viewType, setViewType] = useState("EXPERIENCED");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

  // Initialize lifeList state with the data passed from the route params
  const [lifeList, setLifeList] = useState(
    route.params?.lifeList || { experiences: [] }
  );

  const userId = route.params?.userId || currentUser;
  const isCurrentUser = userId === currentUser;

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
    setEditMode(!editMode);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  const handleBackPress = () => {
    if (editMode && route.params?.fromScreen === "EditExperiences") {
      navigation.navigate("AdminLifeList");
    } else if (editMode) {
      setEditMode(false);
    } else {
      navigation.goBack();
    }
  };

  const [removeExperience] = useMutation(REMOVE_EXPERIENCE_FROM_LIFELIST);

  const handleDeleteExperience = (experienceId) => {
    setSelectedExperienceId(experienceId);
    setModalVisible(true);
  };

  const confirmDeleteExperience = async () => {
    try {
      await removeExperience({
        variables: {
          lifeListId: lifeList._id,
          lifeListExperienceId: selectedExperienceId,
        },
      });
      setLifeList((prevList) => ({
        ...prevList,
        experiences: prevList.experiences.filter(
          (exp) => exp._id !== selectedExperienceId
        ),
      }));
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        onSearchFocusChange={setIsSearchFocused}
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
        searchQuery={searchQuery}
        navigation={navigation}
        onDelete={handleDeleteExperience}
      />
      <CustomAlert
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
