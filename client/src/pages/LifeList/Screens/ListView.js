import React, { useEffect, useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import ListViewNavigator from "../Navigation/ListViewNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { useAuth } from "../../../contexts/AuthContext";
import SymbolButton from "../../../icons/SymbolButton";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import LoadingScreen from "../../Loading/LoadingScreen";
import SymbolButtonSm from "../../../icons/SymbolButtonSm";

export default function ListView({ navigation }) {
  const route = useRoute();
  const { setIsTabBarVisible } = useNavigationContext();
  const [editMode, setEditMode] = useState(false);
  const [viewType, setViewType] = useState("EXPERIENCED");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { currentUser } = useAuth();
  const lifeList = route.params?.lifeList || { experiences: [] }; // Use the passed data

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
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    refetch();
  }, [viewType, refetch]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
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

  if (loading) return <LoadingScreen />;
  if (error) return <Text>Error: {error.message}</Text>;

  const lifeListData = route.params?.lifeList || data.getUserLifeList;

  return (
    <View style={layoutStyles.container}>
      <HeaderSearchBar
        arrowIcon={
          <SymbolButtonSm
            name="chevron.backward"
            onPress={handleBackPress}
            style={{ height: 20, width: 14 }}
          />
        }
        icon1={
          !editMode && (
            <SymbolButton
              name="square.and.pencil"
              style={{ marginBottom: 3 }}
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
            viewType === "EXPERIENCED" && styles.selectedButton,
          ]}
          onPress={() => handleViewTypeChange("EXPERIENCED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "EXPERIENCED" && styles.selectedButtonText,
            ]}
          >
            Experienced
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            viewType === "WISHLISTED" && styles.selectedButton,
          ]}
          onPress={() => handleViewTypeChange("WISHLISTED")}
        >
          <Text
            style={[
              styles.buttonText,
              viewType === "WISHLISTED" && styles.selectedButtonText,
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginTop: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 4,
    paddingVertical: 5,
    width: 165,
  },
  buttonText: {
    textAlign: "center",
  },
  selectedButton: {
    backgroundColor: "#6AB952",
    borderColor: "#6AB952",
  },
  selectedButtonText: {
    color: "#fff",
  },
});
