import React, { useEffect, useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import ListViewNavigator from "../Navigation/ListViewNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import LoadingScreen from "../../Loading/LoadingScreen";
import SymbolButtonSm from "../../../icons/SymbolButtonSm";
import Icon from "../../../icons/Icon";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const [editMode, setEditMode] = useState(false);
  const [viewType, setViewType] = useState("EXPERIENCED");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { currentUser } = useAuth();
  const [lifeList, setLifeList] = useState(
    route.params?.lifeList || { experiences: [] }
  );

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser._id },
    skip: !!route.params?.lifeList, // Skip fetching if data is passed
  });

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    if (route.params?.editMode) {
      setEditMode(true);
    }
  }, [route.params?.editMode]);

  useFocusEffect(
    useCallback(() => {
      if (!route.params?.lifeList) {
        refetch();
      }
    }, [refetch, route.params?.lifeList])
  );

  useEffect(() => {
    if (data && !route.params?.lifeList) {
      setLifeList(data.getUserLifeList);
    }
  }, [data, route.params?.lifeList]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
    refetch(); // Refetch data whenever viewType changes
  };

  const handleBackPress = () => {
    if (editMode && route.params?.fromScreen === "AdminLifeList") {
      navigation.navigate("AdminLifeList");
    } else if (editMode) {
      setEditMode(false);
    } else {
      navigation.goBack();
    }
  };

  const handleDeleteExperience = (experienceId) => {
    setLifeList((prevList) => ({
      ...prevList,
      experiences: prevList.experiences.filter(
        (exp) => exp._id !== experienceId
      ),
    }));
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Text>Error: {error.message}</Text>;

  const lifeListData = route.params?.lifeList || lifeList;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <SymbolButtonSm
            name="chevron.backward"
            onPress={handleBackPress}
            style={{ height: 20, width: 14.61 }}
          />
        }
        icon1={
          !editMode && (
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
        lifeList={lifeListData}
        viewType={viewType}
        editMode={editMode}
        searchQuery={searchQuery}
        navigation={navigation}
        onDelete={handleDeleteExperience}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: "#FBFBFE",
  },
  button: {
    borderWidth: 1,
    borderColor: "#ececec",
    width: "45%",
    borderRadius: 16,
    paddingVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
  },
  experiencedSelectedButton: {
    backgroundColor: "#6AB95230", // Light green with opacity
    borderColor: "#6AB952",
  },
  experiencedSelectedButtonText: {
    color: "#6AB952",
  },
  wishlistedSelectedButton: {
    backgroundColor: "#5FC4ED30", // Light blue with opacity
    borderColor: "#5FC4ED",
  },
  wishlistedSelectedButtonText: {
    color: "#5FC4ED",
  },
});
